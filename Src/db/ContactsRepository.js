import SQLite from 'react-native-sqlite-storage';

// Open or create the database
export const db = SQLite.openDatabase(
    {name: 'contacts.db', location: 'default'},
    () => console.log('Database opened successfully'),
    error => console.log('Error opening database: ', error)
);

/*
 Inicializa la base de datos creando la tabla contacts si no existe.
 Incluye syncStatus para mostrar si el contacto está sincronizado:
 - 'synced': sincronizado
 - 'pending': pendiente de sincronizar
*/
 export const initDB = () => {
    db.transaction(tx => {
        // Crear tabla si no existe
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                syncStatus TEXT DEFAULT 'pending'
            )`,
            [],
            () => console.log('Table created successfully'),
            error => console.log('Error creating table: ', error)
        );
        
        // Agregar columna syncStatus si no existe (para migración)
        tx.executeSql(
            `ALTER TABLE contacts ADD COLUMN syncStatus TEXT DEFAULT 'pending'`,
            [],
            () => console.log('syncStatus column added'),
            () => console.log('syncStatus column already exists')
        );
    });
};

/**
 * Crea un nuevo contacto en la base de datos.
 * El contacto se crea con syncStatus='pending' por defecto.
 */
export const createContact = (contact) => {
    return new Promise((resolve, reject) => {
        if (!contact || !contact.name?.trim() || !contact.phone?.trim()) {
            reject(new Error('Name and phone are required'));
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO contacts (name, phone, email, syncStatus) VALUES (?, ?, ?, ?)',
                [contact.name.trim(), contact.phone.trim(), contact.email?.trim() || '', 'pending'],
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

/**
 * Obtiene un contacto por su ID de la base de datos.
 * @param {number} id - ID del contacto a buscar
 * @returns {Promise<Object|null>} - Contacto encontrado o null si no existe
 */
export const getContactById = (id) => {
    return new Promise((resolve, reject) => {
        if (!id || typeof id !== 'number' || id <= 0) {
            reject(new Error('Valid contact ID is required'));
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM contacts WHERE id = ?',
                [id],
                (_, results) => {
                    if (results.rows.length > 0) {
                        resolve(results.rows.item(0));
                    } else {
                        resolve(null);
                    }
                },
                (_, error) => {
                    console.log('Error getting contact by id: ', error);
                    reject(error);
                }
            );
        });
    });
};

export const updateContact = (id, contact) => {
    return new Promise((resolve, reject) => {
        if (!id || typeof id !== 'number' || id <= 0) {
            reject(new Error('Valid contact ID is required'));
            return;
        }
        
        if (!contact || !contact.name?.trim() || !contact.phone?.trim()) {
            reject(new Error('Name and phone are required'));
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                'UPDATE contacts SET name = ?, phone = ?, email = ?, syncStatus = ? WHERE id = ?',
                [contact.name.trim(), contact.phone.trim(), contact.email?.trim() || '', 'pending', id],
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

/**
 * Actualiza el estado de sincronización de un contacto
 * @param {number} id - ID del contacto
 * @param {string} status - 'synced' o 'pending'
 * @returns {Promise<void>}
 */
export const updateContactSyncStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        if (!id || typeof id !== 'number' || id <= 0) {
            reject(new Error('Valid contact ID is required'));
            return;
        }
        
        if (!['synced', 'pending'].includes(status)) {
            reject(new Error('Status must be "synced" or "pending"'));
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                'UPDATE contacts SET syncStatus = ? WHERE id = ?',
                [status, id],
                () => resolve(),
                (_, error) => {
                    console.log('Error updating sync status: ', error);
                    reject(error);
                }
            );
        });
    });
};

/**
 * Obtiene todos los contactos con estado 'pending'
 * @returns {Promise<Array>} - Lista de contactos pendientes de sincronizar
 */
export const getPendingContacts = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM contacts WHERE syncStatus = ?',
                ['pending'],
                (_, results) => {
                    let contacts = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        contacts.push(results.rows.item(i));
                    }
                    resolve(contacts);
                },
                (_, error) => {
                    console.log('Error getting pending contacts: ', error);
                    reject(error);
                }
            );
        });
    });
};

/**
 * Obtiene todos los contactos sincronizados
 * @returns {Promise<Array>} - Lista de contactos sincronizados
 */
export const getSyncedContacts = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM contacts WHERE syncStatus = ?',
                ['synced'],
                (_, results) => {
                    let contacts = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        contacts.push(results.rows.item(i));
                    }
                    resolve(contacts);
                },
                (_, error) => {
                    console.log('Error getting synced contacts: ', error);
                    reject(error);
                }
            );
        });
    });
};