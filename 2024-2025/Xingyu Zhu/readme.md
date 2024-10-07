# LLM for Qualitative Analysis:Medical data integration

# Minimal Working Demo for Medical data integration

This README outlines the tasks involved in creating a minimal working demo for this project, focusing on reading medical data, processing it, obtaining encoding schemes, mapping to SNOMED, and providing a user interface for checking and editing mappings.

## Project Tasks

### 1. Data Reading
- **Task**: Allow users to select a data file (e.g., CSV, JSON, Excel) from the front end.
- **Data Preview**: Add real-time data preview to let users check data quality before proceeding to the next steps.

### 2. Data Preprocessing
- **Task**: Convert the selected file (e.g., CSV) into a Metadata file (.xlsx)format using White Raddit.
- **Data Preview**: Automatically generate the Metadata file and allow users to manually edit any key fields before proceeding.

### 3. Encoding Scheme Generation
- **Task**: Generate an encoding scheme for mapping data.
  - Option 1: Use **Carrot-Mapper** for existing code schemes 
  - Option 2: Use **LLM** to generate code schemes by:
    - Training or tuning the LLM to understand a standard vocabulary like SNOMED.
    - Inputting the .xlsx file and requesting LLM to output a code scheme in JSON format.
- **Improvements**: Include error handling, highlight invalid encoding, and offer user feedback on the scheme’s completeness.

### 4. Data Mapping to Standard Vocabulary
- **Task**: Map the preprocessed data to SNOMED using the generated encoding scheme.
- **Details**: Utilize the LLM to map data. Include confidence scores for each mapping to inform users of potential inaccuracies.

### 5. Result Checking and Editing
- **Task**: Provide the user with a front-end interface to review the mapping results.
- **Details**: Display the LLM's mapping results and allow users to manually adjust the mappings directly in the interface. Once finished, users can output the updated data as a new CSV or JSON file.
- **Improvements**: Implement visualization tools (e.g., conflict highlights) for better user interaction. Maintain version history for edited mappings.

### 6. Other
- **Task**: Include a progress bar, especially for large datasets, to show task completion status. 

