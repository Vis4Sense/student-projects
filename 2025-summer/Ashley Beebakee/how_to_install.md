#  Installation Instructions (Step-by-step)
<ul>
  <li>Git clone "student-projects" repository from <b>Vis4Sense</b> into a folder of your choice, i.e. "C:\Users\yourUsername".</li>
  <li>Install <b>Anaconda</b> or <b>Miniconda</b> from "https://www.anaconda.com/download".</li>
  <ul>
    <li>Post-installation, open <b>Anaconda Prompt</b> (or similar in name).</li>
  </ul>
  <li>Navigate to this folder "student-projects\2025-summer\Ashley Beebakee" within your Anaconda terminal.</li>
  <ul>
    <li>Then, run this command -> "conda env create -f environment.yml".</li>
    <li>This will recreate the environment used for this project entirely (all packages & dependencies).</li>   
    <img width="549" height="209" alt="image" src="https://github.com/user-attachments/assets/02901af0-7b09-4ef3-9eb0-a68ac09895c4" />
  </ul>
  <li>Open-source LLMs and API keys <b>cannot</b> be stored in GitHub, thereby they are missing and need to be resolved:</li>
  <ul>
    <li>Download https://huggingface.co/Mungert/Llama-3.1-8B-Instruct-GGUF/resolve/main/Llama-3.1-8B-Instruct-iq2_xxs.gguf?download=true.</li>
    <li>Download https://huggingface.co/Mungert/Llama-3.1-8B-Instruct-GGUF/resolve/main/Llama-3.1-8B-Instruct-bf16-q4_k.gguf?download=true.</li>
    <li>Download https://huggingface.co/TheBloke/Orca-2-7B-GGUF/resolve/main/orca-2-7b.Q6_K.gguf?download=true.</li>
    <li>Download https://huggingface.co/tensorblock/bloomz-7b1-mt-GGUF/resolve/main/bloomz-7b1-mt-Q4_K_M.gguf?download=true.</li>
    <ul>
      <li>After downloading all open-source LLMs, paste them into the 'models' folder.</li>
    </ul>
    <li>Create NewsAPI account from "https://newsapi.org".</li>
    <ul>
      <li>Generate an API key, create and paste it into a .txt file called "newsapi_key" and place into 'keys' folder.</li>
    </ul>
    <li>Optional: Create an OpenAI account from "https://openai.com/api".</li>
    <ul>
      <li>Generate an API key (add credit $), create and paste it into a .txt file called "openai_key" and place into 'keys' folder.</li>
    </ul>
  </ul>
  <li>You should now be <b>able</b> to run this modular framework.</li>
</ul><br>
For any queries, feel free to contact me at: ashleybeebakee@hotmail.com.

[Last updated: 07/09/2025 05:40]
