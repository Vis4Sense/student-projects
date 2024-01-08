# User requirement and functionality

### Tab Recognition
1. User need <p>
   Users lack time to manually edit tags and desire the extension to intelligently identify and categorize the content of each tab. 
   
   Recognize the key point of open tabs for downstream steps, particularly task grouping when dealing with multiple tasks simultaneously.
2. Functionality<p>
- Access the current page content while the user is browsing.
- Enable real-time tagging of tabs based on the identified content.
- Create a node for each tab in the interface, allowing for easy visualization and interaction.
   
### Grouping Webpages for Task Recall
1. User need <p>
   Users require an organized structure to recall tasks effortlessly and navigate to crucial links within the context of specific topics. When dealing with several tasks, separate the nodes under different tasks and have different interface sections.

2. Functionality<p>
- Utilize LLM or clustering algorithm to automatically group nodes based on content or topics.
- Add the same label for nodes belonging to the same task.

### High-Level Website and Task Summaries
1. User need <p>
   Provide users with high-level, concise summaries for each website and entire tasks to aid in following the thinking process represented by the history log or website list. 
   
   Users prefer obtaining extracted information directly, enhancing comprehension rather than solely relying on lists and manually exploring content when they try to understand others' thinking processes.

2. Functionality<p>
- Utilize the Chain of Density prompt to generate concise summaries based on page content.
- Employ natural language processing techniques to extract key information and generate meaningful summaries.
- Attach the generated summaries to the corresponding nodes representing each website or task for quick reference.
- Allow users to view or expand the summaries directly from the interface.
- Create comprehensive task documents that compile information from all associated nodes.Include important information, extracted details, and relevant links within the task document.

### Enhanced Information Comprehension
1. User need <p>
   Users seek assistance in comprehending information through visual aids, categorization, and highlighting of critical details. Such as mindmap, detailed list, tree map or flow chart.
2. Functionality<p>
- Implement a treemap in the interface for visualizing relationships between tasks and websites.
- Provide several visualization patterns as options for users to choose from.

### Customization and Interaction
1. User need <p>
    Users have different logic or requirements for the details shown for each node. Give users the flexibility to customize their own interface or add/delete some nodes in the interface that aligns closer to their specific scenarios.
2. Functionality<p>
- Allow users to modify the graph structure and layout, add, or delete labels(detailed information) and nodes.
- Provide several label options for users to choose to display in the interface.
- Ensure that visualizations dynamically update in real-time as users interact with the extension and brows new pages.
### Relevant Content Recommendation System
1. User need <p>
   Users desire a recommendation system that surpasses simple keyword matching, incorporating the thought processes of other users. They want to get inspired by others' browsing results or use them directly to save time when pursuing a specific task.

2. Functionality<p>
- Create a database to store finished search results, capturing a repository of users' successful paths and insights.
- Utilize semantic search to find relevant information in the database and return others' sense-making processes to the user.
- Implement a retriever mechanism within the database to efficiently fetch relevant search results based on user queries.

### Data export
1. User need <p>
    Users require the capability to share their searching result accross efficiently. They need the ability to export the results in a specific format (such as PDF) or generate accessible links for easy sharing.
2. Functionality<p>
- Implement a feature allowing users to export selected nodes or entire tasks as PDF documents. Include options for customization, such as choosing the level of detail or specific elements to include in the PDF.
- Generate shareable links for specific nodes, tasks, or the entire workspace to facilitate easy sharing with colleagues.
- Offer an optional password protection feature for exported PDFs, enhancing security for sensitive information.(option)