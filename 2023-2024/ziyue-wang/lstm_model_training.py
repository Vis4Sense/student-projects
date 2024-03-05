# training elements
epochs = 10
batch_size = 64

# set the callbacks functions
callbacks = [
    EarlyStopping(monitor='val_loss', patience=3, verbose=1, mode='min'),
    ModelCheckpoint('best_model.h5', monitor='val_loss', save_best_only=True, mode='min', verbose=1)
]

# assume`padded_sequences`are the inputs from the pre-processed information,`labels` are the labeled elements
history = model.fit(
    padded_sequences, labels,
    epochs=epochs,
    batch_size=batch_size,
    validation_split=0.2,
    callbacks=callbacks
)
