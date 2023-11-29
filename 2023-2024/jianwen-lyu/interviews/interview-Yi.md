## Interview with Yi 

Q: What is your first impression of Hyperparameter Tuning?

A: It's probably an endless repetition of the same process. You need to continuously modify these parameters, but still don't know what the optimal situation is. It's a cumbersome task.

---

Q: Have you ever encountered projects with difficulties in hyperparameter tuning?

A: Well... the project I'm currently working on does involve complex hyperparameter tuning. It's an AI research project on style transfer. My model needs to adapt to various input styles and achieve high accuracy, requiring a lot of work in terms of hyperparameters. However, the projects I've worked on before didn't involve much hyperparameter tuning because most of them involved reproducing models that were pre-trained and fine-tuned by others.

---

Q: I think it would be much better with an extension that can handle hyperparameter tuning for you, or at least provide guidance. In your opinion, what should the extension be like?

A: I think the extension should automatically help you __identify some trends__ in the "hyperparameter space," such as the impact of increasing or decreasing a certain hyperparameter, let's say the learning rate, on the changes in the hypothesis function values. It should plot a curve to give you an impression of how the results vary with changes in that hyperparameter. It can explore different possibilities within a certain range of hyperparameter values, and users should be able to manually adjust relevant settings. This way, I believe it would greatly assist in training my model because currently, I have to repetitively try different values manually, which is quite tedious.