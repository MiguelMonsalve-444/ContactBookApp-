import SQLite from 'react-native-sqlite-storage';

// Open or create the database
export const db = SQLite.openDatabase(
    {name: 'contacts.db', location: 'default'},
    () => console.log('Database opened successfully'),
    error => console.log('Error opening database: ', error)
);

/*
 Inicializa la base de datos creando la tabla contacts si no existe.
 Validación que name y phone esten llenados 
*/
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

/**
 * Crea un nuevo contacto en la base de datos.
 * Validación: Verifica que contact no sea null/undefined y que name y phone 
 * tengan contenido después de aplicar trim(). Email es opcional.
 * Usa prepared statements (?) para prevenir SQL injection.
 * @param {Object} contact - Objeto con name, phone y email
 * @returns {Promise<number>} - ID del contacto insertado
 */
export const createContact = (contact) => {
    return new Promise((resolve, reject) => {
        // Validación defensiva: verifica campos requeridos
        if (!contact || !contact.name?.trim() || !contact.phone?.trim()) {
            reject(new Error('Name and phone are required'));
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)',
                [contact.name.trim(), contact.phone.trim(), contact.email?.trim() || ''],
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
        // verificar si el ID es valido válido
        if (!id || typeof id !== 'number' || id <= 0) {
            reject(new Error('Valid contact ID is required'));
            return;
        }
        
        // verificar si los campos requeridos estan completos
        if (!contact || !contact.name?.trim() || !contact.phone?.trim()) {
            reject(new Error('Name and phone are required'));
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                'UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?',
                [contact.name.trim(), contact.phone.trim(), contact.email?.trim() || '', id],
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
        //  verificacion de que el ID sea válido
        if (!id || typeof id !== 'number' || id <= 0) {
            reject(new Error('Valid contact ID is required'));
            return;
        }

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