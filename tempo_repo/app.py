from flask import Flask, render_template, request, redirect, flash
from flask_mail import Mail, Message

app = Flask(__name__)

# Flask-Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Use your email provider's SMTP server
app.config['MAIL_PORT'] = 465  # Port for TLS
app.config['MAIL_USE_SSL'] = True  # Use TLS for security
app.config['MAIL_USERNAME'] = 'tommybab7@gmail.com'  # Your email address
app.config['MAIL_PASSWORD'] = 'ojvw qjxw bntw hoze'  # Your email password or app-specific password
app.config['MAIL_DEFAULT_SENDER'] = 'tommybab7@gmail.com'  # Default sender email

mail = Mail(app)

# Secret key for flashing messages
app.secret_key = 'your_secret_key'

@app.route('/')
def home():
    return render_template('Toms.html')

@app.route('/send_email', methods=['POST'])
def send_email():
    if request.method == 'POST':
        # Get form data
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']

        # Create the email message
        msg = Message(
            subject=f"New Message from {name}",  # Email subject
            recipients=['your_email@gmail.com'],  # Your email address
            body=f"Name: {name}\nEmail: {email}\nMessage: {message}"  # Email body
        )

        try:
            # Send the email
            mail.send(msg)
            flash('Your message has been sent successfully!', 'success')
        except Exception as e:
            flash(f'An error occurred: {str(e)}', 'error')

        return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)