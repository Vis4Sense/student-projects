# Minutes of Meeting (MoM)
<ul>
  <li>COMP4026 RsrchProj-Comp Sci (AI)  2024/25</li>
</ul>

## 24th April 2025 (11:00 - 12:00)
Discussion:
<ul>
  <li>Introduction between supervisor and each student talking about their MSc dissertation topic.</li>
  <li>Familiarity with writing up a dissertation based on BSc experience.</li>
  <li>Overview of deadlines and Kai Xu project dashboard.</li>
  <li>Review of coureswork and exam dates to schedule our next meeting.</li>
</ul>
Actions:
<ul>
  <li>Read existing work on 'LLM for Automated Trading' on kaixu.me to come up with somewhat of an idea.</li>
</ul>

## 9th June 2025 (13:00 - 14:30)
Discussion:
<ul>
  <li>Sentiment analysis already has quite high accuracy.</li>
  <li>Technical analysis has room for additional work to be done.</li>
  <li>Proposed idea is for the user to have freedom in blending the configuration for sentiment and technical analysis (with model settings) and be presented with visual results for comparison on training completion.</li>
</ul>
Actions:
<ul>
  <li>Perform a sample test on whether the extraction of multilingual sentiment from a variety of sources may be beneficial for sentiment analysis.</li>
  <li>Read Manasi Mehta's dissertation in more detail to synthesise a robust project proposal.</li>
  <li>Reach completion on the given tasks issued by Kai Xu on the '2025-summer' readme.md file.</li>
</ul>

## 16th June 2025 (13:00 - 14:00)
Discussion:
<ul>
  <li>Reviewed sample test for multilingual sentiment analysis and model that was utilised.</li>
  <li>User to configure different classification models, each one consisting of their respective settings.</li>
  <li>"Full Ethics" declaration form may require submission if human participants are required to test my project (without needing their personal details).</li>
</ul>
Actions:
<ul>
  <li>Populate GitHub issue on multilingual sentiment analysis and perform a closure of the issue.</li>
  <li>Create project proposal draft with defined, specific tasks, i.e. types of features and techniques to be implemented.</li>
  <li>Investigate existing work of configurable interfaces: ML model or simulation (i.e. weather forecast).</li>
  <li>Create GitHub issue for “Preliminary Ethics” form, followed by submission by 18th June, 15:00.</li>
  <li>Create GitHub issue for “Full Ethics” form.</li>
  <li>Create GitHub issue for “Project Proposal”.</li>
  <li>Draft a Gantt chart for the project proposal to visualise whether complexity of project is doable within the implementation time frame.</li>
</ul>

## ~23rd June 2025 (13:00 - 14:00)~
<ul>
  <li>Absent due to illness (22nd June - 25th June).</li>
</ul>

## 30th June 2025 (13:00 - 13:45)
Discussion:
<ul>
  <li>Discussed the Project Plan leading to current work on tasks.</li>
  <li>Explained why Streamlit was chosen to implement the GUI.</li>
  <li>Checked available VRAM for AMD RX6600 XT GPU, should be able to run an LLM locally.</li>
  <li>Discussed O'Reilly course for Prompt Engineering relevancy to Work Package 1 (WP1).</li>
</ul>
Actions:
<ul>
  <li>Continue to learn about Prompt Engineering and create templates for free-to-use LLM APIs.
  <li>Begin drafting the Literature Review on any research done (i.e. Prompt Engineering, Configurable Interfaces, etc.).</li>
  <li>Create the 'base' workflow to test functionality of the system (to be expanded as the weeks pass).</li>
</ul>
Suggestions:
<ul>
  <li>Do not spend too much time on learning Prompt Engineering to avoid delayed implementation of subsequent tasks</li>
</ul>

## ~7th July 2025 (13:00 - 14:00)~
<ul>
  <li>Absent due to unfunctional build of workflow - more time required.</li>
</ul>

## 14th July 2025 (13:00 - 13:45)
Discussion:
<ul>
  <li>Sentiment fusion with time series data at timestamp.</li>
  <li>The framework should not be expected to train real-time data.</li>
  <li>The development of the framework is as expected, giving the user freedom in the configuration of the system.</li>
</ul>
Actions:
<ul>
  <li>Create a database system to store extracted sentiment from news sources (i.e. Reddit, Twitter, NewsAPI, etc.).</li>
  <li>Fuse the database with time series data aligned with the same timestamp as the sentiment. If unavailable, set the field to null or zero.</li>
  <li>Search for other AMD supported LLMs for inclusion in the Streamlit framework.</li>
  <li>Insert the Gantt chart into the readme.md of your project folder 'Ashley Beebakee'.</li>
  <li>Use a text classification LLM model to disregard any scraped data that is not related to crypto.</li>
  <li>Attempt to include non-English new sources into the framework.</li>
</ul>
Suggestions:
<ul>
  <li>Do not spend too much time on refining the scraped data from news sources.</li>
</ul>

## ~21st July 2025 (13:00 - 14:00)~
<ul>
  <li>Dr. Kai Xu is away, meeting is cancelled.</li>
</ul>

## 28th July 2025 (13:00 - 14:15)
Discussion:
<ul>
  <li>Old Reddit vs New Reddit post archive limits. Old Reddit's subreddits have <1000 posts while New Reddit has 500 posts.</li>
  <li>Dataset manipulation to scrape Reddit posts without duplicates and append NewsAPI multilingual headlines.</li>
  <li>Restructure of Work Packages and their respective milestones.</li>
  <li>Integration of Orca 2 with quicker execution than LLaMA 3.1.</li>
</ul>
Actions:
<ul>
  <li>Begin drafting the Literature Review on any research done (i.e. Prompt Engineering, Configurable Interfaces, etc.).</li>
  <li>Fuse the database with time series data aligned with the same timestamp as the sentiment. If unavailable, set the field to null or zero.</li>
  <li>Use a text classification LLM model to disregard any scraped data that is not related to crypto.</li>
  <li>Populate issues that have been completed with details regarding the implementation.</li>
</ul>
Suggestions:
<ul>
  <li>Do not halt progress due to formatting issues or minor bugs, allow for the creation of "prototype_version_1". Additional features and bug fixing can be implemented into "prototype_version_2".</li>
  <li>Interchangeably, the sentiment of a financial news source can affect the market but so can a sudden shift in the market cause the creation of a financial news headline.</li>
</ul>

[Last updated: 28/07/2025 14:15]
