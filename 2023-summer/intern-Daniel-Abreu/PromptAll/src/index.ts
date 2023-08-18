import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { Widget } from '@lumino/widgets';

// Mammoth is used for the word to text conversion
import * as mammoth from 'mammoth';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-promptall',
  description: 'Pair up a prompt and image generated in a JupyterLab panel.',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, IFileBrowserFactory],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    restorer: ILayoutRestorer,
    fileBrowserFactory: IFileBrowserFactory
  ) => {
    console.log('JupyterLab extension jupyterlab_promptall is activated!');

    // Track the sidebar widget to avoid duplicates
    let sidebar: MainAreaWidget<Widget> | null = null;
    const command: string = 'promptall:open';

    // Add an application command
    app.commands.addCommand(command, {
      label: 'PromptAll',
      execute: () => {
        if (!sidebar || sidebar.isDisposed) {
          // Create the sidebar widget only if it does not exist
          const content = createSidebarContent(); // Function to create the sidebar content
          sidebar = new MainAreaWidget({ content });
          sidebar.id = 'promptall-jupyterlab';
          sidebar.title.label = 'PromptAll';
          sidebar.title.closable = true;

          // Track the sidebar to restore it later
          restorer.add(sidebar, 'promptall-jupyterlab');
        }
        if (!sidebar.isAttached) {
          // Attaching the widget to the main work area if it's not there
          app.shell.add(sidebar, 'left');
        }

        // Activate the widget
        app.shell.activateById(sidebar.id);
      }
      
    });

    

    // Add the command to the palette.
    palette.addItem({ command, category: 'Tutorial' });

    // Add a new entry to the context menu for images inside notebooks
    app.contextMenu.addItem({
      command: 'promptall:open',
      selector: '.jp-RenderedImage', // Apply the context menu to rendered images
      rank: 0,
    });
    //NOT WORKING YET!
    
  }
};


function createSidebarContent(): Widget {
  const content = new Widget();
  content.node.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; height: 100%;">
      <h1>PromptAll</h1>
      <div style="text-align: center;">
        <p>This the PromptAll dashboard where you can access your previous prompts and images.</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
      <button id="loadButton" style="padding: 10px 20px; font-size: 16px; background-color: #007BFF; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Load Saved Images</button>
        <button id="loadFolderButton" style="padding: 10px 20px; font-size: 16px; background-color: red; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Load Folder</button>
      </div>
      <div id="imageContainer" style="display: flex; flex-wrap: wrap; justify-content: center; max-height: 800px; overflow: auto; width: 100%;"></div>
      <input type="file" id="fileInput" style="display: none;" multiple accept="image/*">
    </div>
  `;

  const loadButton = content.node.querySelector('#loadButton');
  const loadFolderButton = content.node.querySelector('#loadFolderButton'); // Select the new button
  const imageContainer = content.node.querySelector('#imageContainer');
  const fileInput = content.node.querySelector('#fileInput') as HTMLInputElement;
  const promptToImagesMap = new Map(); // Map to store prompt to image links

  function removeImage(imageWrapper: HTMLElement) {
    if (imageContainer && imageWrapper) {
      imageContainer.removeChild(imageWrapper);
    }
  }
  const fileInputDirectory = document.createElement('input');
  fileInputDirectory.type = 'file';
  fileInputDirectory.style.display = 'none';
  fileInputDirectory.setAttribute('directory', ''); // Set to select directories
  fileInputDirectory.setAttribute('webkitdirectory', ''); // For compatibility with Chrome
  
  fileInputDirectory.addEventListener('change', async (event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
  
    if (files && files.length > 0) {
      // Convert the FileList to an array
      const fileListArray = Array.from(files);
  
      // Sort the files based on the numbers inside parentheses
      fileListArray.sort((fileA, fileB) => {
        const numberA = extractPromptNumber(fileA.name);
        const numberB = extractPromptNumber(fileB.name);
        
        if (numberA === null) {
          return 1; // Move files without numbers to the end
        }
        if (numberB === null) {
          return -1; // Move files without numbers to the end
        }
        
        return numberA - numberB;
      });
  
      for (const file of fileListArray) {
        if (file.name.endsWith('.docx')) {
          const arrayBuffer = await readFileAsArrayBuffer(file);
          const text = await convertWordToText(arrayBuffer);
  
          const prompt = extractPromptName(file.name);
          if (!prompt) {
            continue; // Skip files with no valid prompt
          }
  
          if (!promptToImagesMap.has(prompt)) {
            promptToImagesMap.set(prompt, []);
          }
  
          const imagesForPrompt = findImagesWithPromptNumber(prompt, fileListArray);
          const textContainer = createTextContainer(text, imagesForPrompt);
          imageContainer?.appendChild(textContainer);
        }
      }
    }
  });
  
  function extractPromptNumber(filename: string): number | null {
    const match = filename.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : null;
  }  
  
  //Function that's used to sort the folder in ascending order 
  function extractPromptName(filename: string): string | null {
    const match = filename.match(/\((\d+)\)/);
    return match ? match[1] : null;
  }
  
  
  function findImagesWithPromptNumber(prompt: string, files: File[]): File[] {
    const imagesWithPrompt = files.filter((file) =>
      file.name.includes(`(${prompt})`) && file.type.startsWith('image/')
    );
    return imagesWithPrompt;
  }
  
  
  
  // Helper function to create the new Prompt button
  function createUploadTextButton(imageWrapper: HTMLElement) {
    const uploadTextButton = document.createElement('button');
    uploadTextButton.textContent = 'Upload Prompt';
    uploadTextButton.style.padding = '4px 8px';
    uploadTextButton.style.fontSize = '14px';
    uploadTextButton.style.backgroundColor = '#007BFF';
    uploadTextButton.style.color = '#fff';
    uploadTextButton.style.border = 'none';
    uploadTextButton.style.borderRadius = '4px';
    uploadTextButton.style.cursor = 'pointer';
    uploadTextButton.style.marginTop = '3px'; // space between the buttons

    uploadTextButton.addEventListener('click', () => handleUploadTextButtonClick(imageWrapper));

    return uploadTextButton;
  }

  // Function to handle the new button click and upload the docx
  async function handleUploadTextButtonClick(imageWrapper: HTMLElement) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.docx';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', async (event) => {
      const target = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
      const files = target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          // Converting the binary data to plain text
          const text = await convertWordToText(arrayBuffer); 
  
          // A container element to hold the text and apply styles to it
          const textContainer = document.createElement('div');
          textContainer.style.display = 'flex';
          textContainer.style.justifyContent = 'center';
          textContainer.style.alignItems = 'center';
          textContainer.style.padding = '8px';
          textContainer.style.border = '2px solid #007BFF';
          textContainer.style.borderRadius = '4px';
          textContainer.style.marginTop = '8px'; // Add some space between the image and the text
          textContainer.style.fontFamily = 'Arial, sans-serif'; // Customize the font-family

          // Text element to display the plain text
          const textElement = document.createElement('div');
          textElement.textContent = text;

          // Append the text element to the container
          textContainer.appendChild(textElement);

          // Append the container element to the imageWrapper
          imageWrapper.appendChild(textContainer);

          console.log('Uploaded text content:', text);
}
  
        reader.readAsArrayBuffer(file);
      }
    });

    // Trigger the file input click event
    fileInput.click();
  }
  
  if (loadButton) {
    loadButton.addEventListener('click', () => {
      // Trigger the file input click event
      fileInput?.click();
    });
  }
  if (loadFolderButton) {
    loadFolderButton.addEventListener('click', () => {
      // Trigger directory selection
      fileInputDirectory.click();
    });
  }


  

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const files = fileInput.files;
      if (imageContainer && files && files.length > 0) {
        for (const file of files) {
          const image = new Image();
          image.src = URL.createObjectURL(file);
          image.style.maxWidth = '200px'; // Adjusting the image size
          image.style.margin = '8px'; // Some margin between images

          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.style.padding = '4px 8px';
          removeButton.style.fontSize = '14px';
          removeButton.style.backgroundColor = '#FF4444';
          removeButton.style.color = '#fff';
          removeButton.style.border = 'none';
          removeButton.style.borderRadius = '4px';
          removeButton.style.cursor = 'pointer';
          removeButton.addEventListener('click', () => removeImage(imageWrapper));

          const imageWrapper = document.createElement('div');
          imageWrapper.style.display = 'flex';
          imageWrapper.style.flexDirection = 'column';
          imageWrapper.style.alignItems = 'center';
          imageWrapper.style.margin = '8px'; // Some margin between images
          imageWrapper.appendChild(image);
          imageWrapper.appendChild(removeButton);
          imageWrapper.appendChild(createUploadTextButton(imageWrapper)); // Adding the new button to the imageWrapper

          imageContainer.appendChild(imageWrapper);
        }
      } else {
        console.log('No images selected.');
      }
    });
  }

  return content;
}


function createTextContainer(text: string, images: File[]): HTMLElement {
  const textContainer = document.createElement('div');
  textContainer.style.display = 'flex';
  textContainer.style.flexDirection = 'column';
  textContainer.style.alignItems = 'center';
  textContainer.style.padding = '8px';
  textContainer.style.border = '2px solid #007BFF';
  textContainer.style.borderRadius = '4px';
  textContainer.style.marginTop = '8px';
  textContainer.style.fontFamily = 'Arial, sans-serif';

  const textElement = document.createElement('div');
  textElement.textContent = text;

  textContainer.appendChild(textElement);

  // Create image elements and append them to the text container
  for (const imageFile of images) {
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);
    image.style.maxWidth = '200px'; // Adjusting the image size
    image.style.marginTop = '8px'; // Space between text and images

    textContainer.appendChild(image);
  }

  return textContainer;
}


async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result instanceof ArrayBuffer) {
        resolve(event.target.result);
      } else {
        reject(new Error('Failed to read file as ArrayBuffer.'));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

async function convertWordToText(arrayBuffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim(); // Removes whitespaces

  // Extracts the text inside the square brackets from the "text_prompts" section
  // of the word document
  const startIndex = text.indexOf('"text_prompts": {');
  if (startIndex !== -1) {
    const openBracketIndex = text.indexOf('[', startIndex);
    const closeBracketIndex = text.indexOf(']', openBracketIndex);
    if (openBracketIndex !== -1 && closeBracketIndex !== -1) {
      return text.slice(openBracketIndex + 1, closeBracketIndex);
    }
  }

  return '';
}

export default plugin;
