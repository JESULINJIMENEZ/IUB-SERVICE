import nodemailer from 'nodemailer';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendEmailRegister = async (username: string): Promise<void> => {
    const mailOptions: MailOptions = {
        from: process.env.EMAIL_USER as string,
        to: username,
        subject: 'Bienvenido a Nuestra Plataforma',
        text: `Hola ${username},\n\nGracias por registrarte en nuestra plataforma. ¡Estamos encantados de tenerte con nosotros!`,
        html: `<b>Hola ${username}</b>,<br><br>Gracias por registrarte en nuestra plataforma. ¡Estamos encantados de tenerte con nosotros!`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo de bienvenida enviado con éxito');
    } catch (error) {
        console.error('Error al enviar correo de bienvenida:', error);
        throw error;
    }
};

export default sendEmailRegister;