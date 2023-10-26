# Project Proposal

**Project Title:** Chat with your Data: LLM and Vector Database

**Author:** Hongye An

**Email:** psxah15@nottingham.ac.uk

## 1. Background Research

In nowadays, information retrieval and literature review have become increasingly challenging tasks. Traditional keyword-based search methods may face challenge in this scenery and it may often fail to uncover relevant documents when the content is described using varying terminology.

## 2. Problem Solutions

Large Language Models (LLMs) have emerged as a promising solution to this problem. LLMs can convert textual information into a high-dimensional vector space, where semantically similar documents cluster together, even when they use different words or phrases. 

However, conversational interfaces for LLMs have a limited prompt size, making them unsuitable for long documents like academic papers. A solution is to build a system that stores documents in their vector form in a vector database, facilitating efficient and scalable document retrieval.

## 3. Goals and Objectives

This project aims to leverage the power of LLMs and vector databases to create a user-friendly tool for efficient document retrieval and exploration.

Key objectives:

- Develop a user-friendly user interface that implement a conversational interface for natural language queries.

- Integrate LLMs and vector database.

- Provide users with highly available document search capabilities.

- Allow user to set specific dataset.


## 4. Project Plan

### 4.1 Document repository: 
The system will provide a repository for users to store and manage input documents. This repository can include a wide range of content, from academic papers or university extenuating circumstance policy documents, and allow users to specify or upload their own custom documents in a specific field.

### 4.2 Vectorization: 
- **LLM Model**: Using online LLMs API such as chatGPT API or locally (such as [Llama by Meta](https://ai.meta.com/llama/)) to generate vector information of all documents in the repository.

- **Vectorization information storage**:
Leveraging the vector database (such as: [Chroma](https://www.trychroma.com/)) to store the vector information, which enabling efficient retrieval based on semantic similarity.

### 4.3 Backend service
Build a high-performance and scalable backend service to handle user input requests, interact with large models and vector databases, and develop highly available backend programs.

### 4.4 User Interface
This project will provide a web-based UI interface that offers users a good user experience.

## 5. Timeline Planning

| Item | start | end |
| ---- | ----- | --- | 
| Project confirmation and start | 2023 Oct 14 | 2023 Oct 20 |
| Write project proposal and ethics checklist | 2023 Oct 21 | 2023 Oct 29 |
| Review background knowledge and papers | 2023 Oct 30 | 2023 Nov 10 |
| Completed a preliminary project draft demo | 2023 Mid Nov | 2023 Early Dec |
| Using some datasets to test and optimization | 2023 Early Dec | 2023 Mid Dec | 
| First semester report and supplementary material | 2023 Mid Dec | 2024 Mid Jan | 
| Prepare for the first semester presentation | 2024 Mid Jan | 2024 Feb 8th |
| Improve the deficiencies in the project and <br> finishing the dissertation and supplementary material | 2024 Mid Feb | 2024 Mid May | 
| Finishing the research paper | 2024 Mid May | 2024 Early Jun | 


## 6. Evaluation

### 6.1 User Study
Hire test volunteers and use documents related to their areas of interest as data repository input files, Collect user feedback through surveys, interviews, or feedback forms as the main reference of evaluation.

### 6.2 Date Retrieval Performance
Evaluate the efficiency of the vector database. Measure the speed and scalability of document retrieval as the database grows. Use QPS, data size as the main metrics.

### 6.3 Document Retrieval Accuracy
Assess the precision and recall of the system by comparing retrieved documents to a ground truth or user-defined relevant documents. Use precision, recall, error or other metrics to evaluate the accuarcy.