import User from './models/user';
import bcrypt from 'bcrypt';

async function seed() {

    const saltRounds = 10;

    const encryptedAdminPassword = await bcrypt.hash('admin', saltRounds);
    await User.findOrCreate({
        where: { id: 1 },
        defaults: {
            id: 1,
            name: 'admin',
            email: 'admin@gmail.com',
            password: encryptedAdminPassword,
            cellPhone: '1234567890',
            role: 'admin',
        }
    });

    const encryptedUserPassword = await bcrypt.hash('user', saltRounds);
    await User.findOrCreate({
        where: { id: 2 },
        defaults: {
            id: 2,
            name: 'user',
            email: 'user@gmail.com',
            password: encryptedUserPassword,
            cellPhone: '1234567890',
            role: 'user',
        }
    });
}

seed().catch((error) => {
    console.error('Error seeding data:', error);
});

export default seed;