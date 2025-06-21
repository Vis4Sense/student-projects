# LLM for Qualitative Analysis:Medical data integration
## Data_Loading_Script.sql Usage Guide

This document provides a set of `\copy` commands for use in the psql command-line tool to efficiently load OMOP CDM standard vocabulary tables (in CSV format) downloaded from OHDSI Athena into a PostgreSQL database.

### Prerequisites

Before running any commands in this guide, ensure the following preparations are complete:

1. **PostgreSQL Installed**: A running PostgreSQL database instance must be available on your system.
2. **Database and User Created**: A database for storing OMOP data must be created, along with a user who has sufficient permissions (at least write access to the target tables).
3. **OMOP CDM Table Structure Created**:  
   This is the most critical step. The commands in this guide only handle data loading, not table creation.  
   You must have obtained the DDL scripts (located in the OHDSI folder) from the OHDSI/CommonDataModel repository and successfully created all required empty tables in your database.
