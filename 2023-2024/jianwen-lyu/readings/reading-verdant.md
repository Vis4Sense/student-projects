## Verdant Reading Notes

### Requirements (for Data Analysis Process)

__Difficulty__: It is usually difficult for Data Scientists to retrieve their previous experiment and choices, they often confuse: "why I made such a choice, or what did this experiment tell me? under what assumption and with what results did I conduct this experiment?"

__Approaches__: Take notes, use version control tools, copy all experiment process into checkpoints. Disadvantage: not clear and intuitive enough.

__Requirements__: A 1.complete and 2.resonably intepreted history for data analysis.

### Previous Works

These works provide complete or semi-complete history by auto-capturing heckpoints of a data scientist's work at regular time intervals (e.g. every run of code)

Their disadvantages: less readability, because they usually have countless versions and user need to manually find important-changes-included ones.

Also, user need to __interact__ with their history activities.

### litGit

version control tool for storing history by artifacts:
- Jupyter Artifact:
    - Markdown Cell Artifact
    - Code Cell Artifact: 
        - Code Snippet Artifact
    - Output Artifact:

__history update__: check artifact-based changes (by catching relevant events, including "notebook saved cell run", "notebook loaded cell deleted", "cell added" and "cell moved"), after an artifact changed, all its child artifacts will change.

__ipyhistory__: artifact histories are stored in one JSON file foo.ipyhistory.

### User View

- History Tab: general temperal sequence history.
- Artifacts Tab: history of each artifact, added inspecter (for history of each artifact). This only have artifacts in newest notebook version.
- Search Tab: seach for artifacts by keyword.()

### Ghost Book
- for further detail of the previous version of notebook, a ghost books is provided for all contents in that previous version, and where had been changed. Also support "changed parts shown only" function.

