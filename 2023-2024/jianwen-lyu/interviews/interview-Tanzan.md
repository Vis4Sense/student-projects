Q: 你最近的项目使用的模型采用了什么样的超参数调整方法？模型的表现如何？
A: 我的毕业设计项目先后采用了XGBoost和随机森林，使用了网格搜索来进行超参数调整。实际上这些模型表现都不太好，主要问题是都呈现出大量的过拟合趋势，尽管在训练集上表现良好，但测试集上的准确率大多在20%以下。

Q: 你觉得表现不好和超参数调整有关吗？
A: 应该是有关的，因为我已经注意到并尽量避免了由于特征数量过多所导致的特征崩塌问题。因为我在超参数调整过程中使用了网格搜索，或许是网格搜索太过局限于训练集上的数据，导致搜索出来的超参数配置太过针对于训练集上的数据分布，因而导致了测试集上过拟合的情况。这应该是网格搜索的一个弊端也说不定。