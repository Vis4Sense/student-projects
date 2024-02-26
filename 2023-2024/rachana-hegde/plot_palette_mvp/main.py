from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)


# Make storyboard
@app.route("/")
def create_storyboard():
    return render_template("storyboard.html")


if __name__ == '__main__':
    app.run(debug=True)


