from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)


# Make new storyboard
@app.route("/create_storyboard")
def create_storyboard():
    return render_template("create_storyboard.html")


# Build storyboard
@app.route("/storyboard")
def build_storyboard():
    return render_template("storyboard.html")


if __name__ == '__main__':
    app.run(debug=True)


