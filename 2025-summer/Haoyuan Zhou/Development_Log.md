# Date: June 21, 2025
# Project: Lettuce Tool Deployment and Testing

## 1. Project Goal
Following the official tutorial, successfully install the Lettuce tool on my macOS environment, set up the required OMOP CDM vocabulary database, and run a query as a test.

## 2. Development Process and Challenges
The process was far more complex than expected. The challenges were divided into two main stages: local environment setup and core database configuration.

### Stage 1: Local Environment and Dependency Setup

**Challenge 1**: Permission Issues with uv Installation Script (Permission Denied)

**Problem Description**: The uv installation script failed due to insufficient permissions when trying to configure Shell environment files like .zshrc, resulting in the uv command being unusable after installation.

**Solution**: This was resolved in two steps. First, I fixed the ownership of the configuration file using `sudo chown emzy ~/.zshrc`. Then, I manually appended the uv installation path to the configuration file with `echo 'export PATH=...' >> ~/.zshrc` and applied the changes using `source ~/.zshrc`.

**Challenge 2**: Environment Configuration File Issues

**Problem Description**: When running `lettuce-cli`, I encountered two issues with the .env file:
1. *File Not Found* (No environment file found at: .env): The program couldn’t locate the database configuration file.
2. *File Format Error* (Failed to parse environment file): After creating the .env file, the program couldn’t parse it, showing a warning that the file content started with `{\rtf1\ansi...`.

**Solution**:
1. For the missing file, I created a .env file and added the database connection details.
2. For the format error, I realized macOS’s TextEdit app had saved the file in Rich Text Format (RTF). After failing to convert the format, I used a reliable command-line approach with `echo "..." > .env` to overwrite the file with correct plain text content, resolving the issue.

### Stage 2: Core Challenge - OMOP CDM Database Setup
After configuring the local environment, the real challenge emerged.

**Challenge 3**: Database Table Not Found (relation "cdm.concept" does not exist)

**Problem Description**: Lettuce connected to the database but crashed during a query, indicating that the `cdm.concept` table was missing.

**Solution**: I diagnosed that my database was an empty instance without the OMOP CDM dataset required for Lettuce. This led to a lengthy but critical data loading process.

**Challenge 4**: Template Variable Issue in Official SQL Script (syntax error at or near "@")

**Problem Description**: When executing the table creation scripts downloaded from OHDSI’s GitHub (stored in the OHDSI folder) in psql, the database reported a syntax error at the `@` symbol.

**Solution**: I discovered that `@cdmDatabaseSchema` in the scripts was a placeholder, not valid SQL. Using a text editor’s “find and replace” function, I replaced all instances of `@cdmDatabaseSchema` with my intended schema name, `cdm`.

**Challenge 5**: Data and Table Structure Mismatch (value too long for type character varying(...))

**Problem Description**: During data loading with `\copy`, the `concept` and `concept_synonym` tables failed to load, with errors indicating that some row text exceeded the `varchar(255)` or `varchar(1000)` column length limits.

**Solution**: I realized the official table creation scripts underestimated column lengths. I resolved this by using `ALTER TABLE cdm.<table> ALTER COLUMN <column> TYPE TEXT;` to change the problematic columns to the `TEXT` type, which has no length limit, allowing successful data import.