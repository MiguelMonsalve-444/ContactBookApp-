import SQLite from 'react-native-sqlite-storage';

// Open or create the database
export const db = SQLite.openDatabase(
    {name: 'contacts.db', location: 'default'},
    () => console.log('Database opened successfully'),
    error => console.log('Error opening database: ', error)
);

// Create the contacts table if it doesn't exist
 export const initDB = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT
            )`,
            [],
            () => console.log('Table created successfully'),
            error => console.log('Error creating table: ', error)
        );
    });
};

export const createContact = (contact) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)',
                [contact.name, contact.phone, contact.email],
                (_, results) => resolve(results.insertId),
                (_,error) => {
                    console.log('Error inserting contact: ', error);
                    reject(error);
                }
            );
        } );
    });
};

export const readContacts = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {  
            tx.executeSql(
                'SELECT * FROM contacts',
                [],
                (_, results) => {
                    let rows = results.rows;
                    let contacts = [];    
                    for (let i = 0; i < rows.length; i++) {
                        contacts.push(rows.item(i));
                    }
                    resolve(contacts);
                },
                (error) => {
                    console.log('Error reading contacts: ', error);                
                    reject(error);
                }
            );
        });
    });
};

export const updateContact = (id, contact) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?',
                [contact.name, contact.phone, contact.email, id],
                () => {resolve()},
                (_, error) => {
                  console.log('Error updating contact: ', error);
                  reject(error);
                }
            );
        });
    }                           
);};

export const deleteContact = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {  
            tx.executeSql(
                'DELETE FROM contacts WHERE id = ?',
                [id],
                () => {
                    resolve();
                },
                (_, error) => {
                    console.log('Error deleting contact: ', error);
                    reject(error);
                }
            );
        });
    });
};