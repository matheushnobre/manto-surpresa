import smtplib
import os
from email.mime.text import MIMEText

from dotenv import load_dotenv
load_dotenv()

def send_email_when_create_order(order, payment):
    recipient = order.client.email
    subject = "Pedido criado!"

    items = "\n".join(
        f"- {item.quantity}x {item.box.name} ({item.size}) - R${item.unit_price:.2f}" for item in order.items
    )

    body = (
        f"Olá, {order.client.name}!\n\n"
        "Obrigado pela confiança na Manto Surpresa e por comprar conosco!\n\n"
        f"Para confirmarmos seu pedido, realize o pagamento de "
        f"R$ {order.subtotal:.2f} por meio do seguinte link Pix:\n"
        f"{payment['payment_method']['ticket_url']}\n\n"
        f"Itens do pedido:\n{items}\n\n"
        "Agradecemos pela preferência!\n"
        "Equipe Manto Surpresa"
    )

    send_email(subject, body, recipient)

def send_email_when_confirmed_order(order):
    recipient = order.client.email
    subject = "Pedido confirmado!"

    items = "\n".join(
        f"- {item.quantity}x {item.box.name} ({item.size}) - R${item.unit_price:.2f}" for item in order.items
    )

    body = (
        f"Olá, {order.client.name}!\n\n"
        "O pagamento para seu pedido acaba de ser processado pela nossa equipe!\n\n"
        f"Itens do pedido:\n{items}\n\n"
        "Agradecemos pela preferência!\n"
        "Equipe Manto Surpresa"
    )

    send_email(subject, body, recipient)

def send_email(subject, body, recipient):
    smtp_server = 'smtp.gmail.com'
    port = 587
    user = os.getenv("USER_EMAIL")
    password = os.getenv("PASSWORD_EMAIL")

    server = smtplib.SMTP(smtp_server, port)
    server.starttls()  # Start TLS encryption
    server.login(user, password)

    message = MIMEText(body)
    message['Subject'] = subject
    message['From'] = user
    message['To'] = recipient

    server.send_message(message)
    server.quit()