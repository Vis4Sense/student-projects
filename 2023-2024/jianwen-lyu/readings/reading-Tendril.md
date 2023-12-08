## HyperTendril: Visual Analytics for User-Driven Hyperparameter Optimization of Deep Neural Networks

- AutoML: optimize hyper-parameters for Machine Learning, However, require __delicate configuration setting (for e.g. genetic algorithm...)__, and these configurations are task specified. 

- Need: __Human Intervention__ in the HyperOpt process, a visual analytics system, let user steer optimization process.

- Important Functions (of HyperTendril): 
    - user's exploration history
    - algorithm configurations diagnose (what problem you may have in configurating your hyper-parameter optimizing algorithm).
    - guidance on refining search space (quantitative method of h-param importance): which hyper-parameters are important.

- the article emphasis "human insights" are required in the system.

- Google's Google Vizier: user manage and monitor h-p-tuning process, plot for analysing h-param.

- Hyper-parameter optimization (HyperOpt): finding a set of optimal hyperparameter values (that maximizes performance) before model training.

- HyperOpt Optimization Loop: 
    - Hyper-parameter setting lambda -> Model -> Validation Performance -> Optimizer(sample better h-p-setting from h-p-space, usually a back-box) -> Hyper-parameter setting lambda
    - Optimizer: Sequencial Model based, Genetic Algorithm based, bandit based.
    - key configurations for user: 
        1. Hyper-parameter candidates to search and their range
        2. computational budget
        3. the optimization algorithm to use and its configuration
    
- Analytical needs in HyperOpt (visualizations should consider these): 
    1. identify effective hyper-parameters: show influences on performance of each hyper-parameter, help find effective/ineffective hyper-parameters.
    2. diagnose autoML algorithm: (problem: user not familiar with search algorithm) need visual analytics for Opt algorithms and config.
    3. validate and select models: should select model with user requirement instead of general performance.

- user still need interatively run the HyperOpt process to find satisfactory models.

- user lack knowledge and experience with HyperOpt algorithms.

- Why autoML returns best model among different models(instead returnning best hyper-parameter setting for one model)?
    > AutoML: first user give a set of interested models, then for each of these models, find best hyper-parameter combinations, and compare performance of these optimal models, return the best one.

- Design Goals:
    - analysis of efficient hyper-parameters, interface for 
    - visual representation that let user understand how hyper-opt algorithm works and diagnose whether the algorithm is effectively improving model performance
    - model selection from multiple perspectives
    - interface for iterative(multiple rounds) hyper-parameter tuning

- before analysis on effective hyperparameters and individual models: need ti determine whether the hyper-parameter optimization algorithm works properly.

- user interface of HyperTendril: 
    1. view for monitoring performance improvement: peak-perfromance history of the model (sequencial order), help user check if the optimization algorithm is really making progress.
    2. exploration history of __each hyperparameter search space__: 

- well known search algorithms:
    - Random search
    - Sequential model based: search hyperparameters based on prior results
    - Bandit based: sample hyper-paramters with configured size R and evalaute, halve the given model set after each evaluation
    - population based: use genetic algorithms, sample hyperparameters with population size P and select k-best by survivial rate, repeat for G generations

- measure the importance of hyper-parameters: functional-ANOVA (fANOVA).
    - ANOVA: through measuring how different each class is after dividing samples by one feature/factor, we can see the importance of this feature/factor.
    - fANOVA: in fANOVA, we need to determine the influences of several factors to __functional data (change along time or other variables, such as time-sequential data or curve)__, this method usually used to decompose the variability of the functional data, turn its change into changes caused by different factors or from different perspective. (here the tool use this method to identify the importance of hyperparameters, choose fANOVA bacause the tool needs to endure linear-time performance in computing the importance(__?__)) 
        1. identify the total variability (pattern or extent of change)
        2. decompose the total variability into vriabilities from different causes. 
        3. then we can quantitize the influences of each factor to the variability.  

- implementation:
    - React.js
    - D3.js (visualization components)
    - fANOVA method: official code in python
    - pass backend data to frontend in form of JSON
    - reservior sampling: fix the size of log(history) data of each model          

- Hyper-parameters in UI
    - first have a total performance plot
    - under this plot include plot of values of all hyper-parameters

- Potential differences from my project:
    - this project focus on auto-ML, which includes hyper-parameter tuning and confiuration, and model selection. In contrast, my project as a notebook extension, should be based on user's code, which in most cases is about one model and may not need model-selection part.
    - in the important hyper-param recognizing part of the article, I am not sure about "the hyper-parameters with low-performance expectations can be removed from the search spaces, thus effectively steering the search process" -- the "remove" here refers to "let it not change anymore or use some default value", or "delete it from hyperparamters of the model"? 
    - Tendril needs to work together with existed autoML frameworks.
    - still not sure: since the goal is "importance of hyper-parameters on model performance", why the article use fANOVA, i.e. identify "model performance" as functional changing value?

- Future work (mentioned in article)
    - scalability of visualization should be improved (not enough space for too many hyper-parameters?)
    - hyper-parameter importance estimation(by fANOVA) has some limitations.