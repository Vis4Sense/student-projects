# PromptAll 
# JupyterLab PromptAll Extension Documentation

## Overview

The JupyterLab PromptAll extension is a plugin for [JupyterLab](https://jupyterlab.readthedocs.io/en/stable/) that pairs up a text prompt and images generated in a JupyterLab panel. This extension allows users to load and display text prompts and associated images conveniently within a JupyterLab environment.

The following will show how the extension works and provide guidance on how to extend it for further development.

## Getting Started

### Installation

To use the JupyterLab PromptAll extension, you need to install it first. Follow these steps:

1. Open a terminal or command prompt.

2. Make sure you have JupyterLab installed. If not, you can install it using `pip`:

   ```
   pip install jupyterlab
   ```

3. Install the extension:

   ```
   jupyter labextension install @jupyterlab-promptall/jupyterlab-promptall
   ```

4. Start JupyterLab:

   ```
   jupyter lab
   ```

### Activation

After installing the extension and starting JupyterLab, open the View Panel -> Activate Command Palette and type "PromptAll". It will then open up on the side panel where you can access the interface.

## How It Works

The JupyterLab PromptAll extension adds a new panel to JupyterLab called "PromptAll." This panel allows users to access and manage previous prompts and their associated images by either uploading a whole folder with the images and settings that follow a specific naming convention or by uploading an individual image and setting for the ones that do not follow this convention.

### Loading Prompts and Images

The PromptAll panel provides two options for loading prompts and images:

- **Load Saved Images**: This button allows you to select and load saved images from your local system, with then the option to upload a settings file.

- **Load Folder**: This button enables you to select a folder containing prompt files and associated images. The extension will organize and display these prompts and images in the panel based on a naming convention which can be seen on "The Lady" folder.2

### Managing Prompts and Images

In the PromptAll panel, you can:

- View previously saved prompts and their associated images.

- Upload new text prompts and associate them with images.

- Remove individual images and associated text prompts.

## Extending the Extension

Developers can extend the JupyterLab PromptAll extension to add new features or customize existing functionality. Below are some guidelines on how to extend the extension:

### Adding New Features

To add new features to the extension, you can:

- Extend the context menu functionality to perform custom actions on images or prompts.

- Modify the appearance and layout of the PromptAll panel to accommodate additional content or controls.

- Enhance the prompt loading process to support different file formats or sources.

### Modifying the User Interface

To modify the user interface of the PromptAll panel, you can:

- Update the HTML structure and styles in the `createSidebarContent` function to change the layout and appearance of the panel.

- Customize the appearance of buttons, containers, and text elements to match your design requirements.

### Handling New File Formats

To support additional file formats or convert text prompts from different sources, you can:

- Modify the `convertWordToText` function to handle different file formats or text extraction methods.

- Extend the `createTextContainer` function to display content in the desired format.

### Adding Context Menu Actions

To add custom context menu actions for images or prompts, you can:

- Extend the context menu configuration in the `activate` function. Update the `app.contextMenu.addItem` method to define new commands and selectors.

- Create new command functions to handle the actions associated with the context menu items.

## Requirements

- JupyterLab >= 4.0.0
- @jupyterlab/apputils
- @jupyterlab/filebrowser
- @lumino/widgets
- mammoth

## Contributing
### Development install

Notes: 
- You will need NodeJS to build the extension package.
- All development code is written under the index.ts file under ./scr
- The Mammoth JS library is used to convert the .docx text_prompts into plain text that can be displayed on the extension panel

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab.

```bash
# Clone the repo to your local environment
# Change directory to the PromptAll directory
# Install package in development mode
pip install -e "."
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. 

