#------------------------------------------------------------#
# Name: Project Timeline: LLM for Automated Trading
# Description: This script generated a Gantt chart in order to
#              visualise the status of the MSc project.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 28/07/2025
# Python Version: 3.10.6
# Packages Required: pandas, matplotlib
#------------------------------------------------------------#

# Import necessary libraries
import matplotlib.pyplot as plt
import pandas as pd
import matplotlib.dates as mdates
from matplotlib.patches import Patch

# Define the Work Packages and their start/end dates
data = {
    'Task': [
        'WP1 – Focused Literature Review',
        'WP2 – Streamlit UI & GitHub Integration',
        'WP3 – LLM Integration & Prompt Engineering',
        'WP4 – Data Acquisition, Sentiment Analysis & Pre-Processing',
        'WP5 – Model Training & Integration',
        'WP6 – Testing, Results & Evaluation',
        'WP7 – Conclusion & Future Work',
        'WP8 – Dissertation Finalisation & Presentation'
    ],
    'Start': pd.to_datetime([
        '2025-06-23', '2025-06-30', '2025-06-23', '2025-07-14',
        '2025-07-28', '2025-08-11', '2025-08-25', '2025-09-01'
    ]),
    'End': pd.to_datetime([
        '2025-08-25', '2025-07-14', '2025-08-04', '2025-08-11',
        '2025-08-11', '2025-08-25', '2025-09-08', '2025-09-12'
    ])
}

# Define custom colours based on corresponding legend descriptions
custom_colors = {
    'WP1 – Focused Literature Review': ('mediumseagreen', 'Documentation'),
    'WP2 – Streamlit UI & GitHub Integration': ('salmon', 'Development'),
    'WP3 – LLM Integration & Prompt Engineering': ('salmon', 'Development'),
    'WP4 – Data Acquisition, Sentiment Analysis & Pre-Processing': ('salmon', 'Development'),
    'WP5 – Model Training & Integration': ('salmon', 'Development'),
    'WP6 – Testing, Results & Evaluation': ('salmon', 'Development'),
    'WP7 – Conclusion & Future Work': ('mediumseagreen', 'Documentation'),
    'WP8 – Dissertation Finalisation & Presentation': ('mediumseagreen', 'Documentation'),
}

df = pd.DataFrame(data)
df['Duration'] = (df['End'] - df['Start']).dt.days

# Reverse the DataFrame so first WP appears on top
df = df[::-1].reset_index(drop=True)

# Plot
fig, ax = plt.subplots(figsize=(12, 6))
legend_handles = []

for i, task in df.iterrows():
    color, label = custom_colors.get(task['Task'], ('skyblue', 'Other Tasks'))
    ax.barh(i, task['Duration'], left=task['Start'], color=color)
    if color not in used_colors:
        legend_handles.append(Patch(color=color, label=label))
        used_colors[color] = label

# Format y-axis
ax.set_yticks(range(len(df)))
ax.set_yticklabels(df['Task'])

# Format x-axis with weekly ticks from 23rd June to 12th September 2025
start_date = pd.to_datetime('2025-06-23')
end_date = pd.to_datetime('2025-09-12')
week_ticks = pd.date_range(start=start_date, end=end_date, freq='W-MON')
ax.set_xticks(week_ticks)
ax.xaxis.set_major_formatter(mdates.DateFormatter('%d-%b'))

# Labels and title
ax.set_xlabel('Date')
ax.set_title('Project Timeline: LLM for Automated Trading')

# Add legend
ax.legend(handles=legend_handles, title='Legend', loc='upper right')

plt.tight_layout()
plt.grid(axis='x')
plt.show()
