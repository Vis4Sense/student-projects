import numpy as np
import pandas as pd

# 你提供的分数数据
scores = [
    0.5837453085614127,
    0.49442264571037753,
    0.4742345888979506,
    0.2309506954680183,
    0.1898222680834235,
    0.18820904515774128,
    0.1250022716654112
]

# 实现“均值 + 标准差筛选法”
def select_top_by_mean_std(scores, std_multiplier=0.5):
    mean = np.mean(scores)
    std = np.std(scores)
    threshold = mean + std_multiplier * std
    selected = [s for s in scores if s >= threshold]
    return {
        "mean": mean,
        "std": std,
        "threshold": threshold,
        "selected": selected
    }

# 运行测试
result = select_top_by_mean_std(scores)
print(result)
# result_df = pd.DataFrame({
#     "score": scores,
#     "above_threshold": [s in result["selected"] for s in scores]
# })

# import ace_tools as tools; tools.display_dataframe_to_user(name="筛选结果（均值 + 标准差法）", dataframe=result_df)

# result