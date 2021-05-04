const express = require('express'); // importo express
const mysql = require('mysql'); // importo mysql

var bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

// MySQL connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db_tasks'
});


const app = express();

app.use(bodyParser.json());

//Routes
app.get('/', (req, resp) => {
    resp.send('bienvenido a mi api')
});

//obtener todas las tareas
app.get('/tareas', (req, res) => {
    const sql = 'SELECT * FROM db_tasks.tareas';

    connection.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Not results')
        }
    });
});

//obtener una tarea por id

app.get('/tareas/:id', (req, res) => {

    const { id } = req.params
    const sql = `SELECT * FROM tareas WHERE id = ${id}`

    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not result')
        }
    });

});

//agregar

app.post('/nuevaTarea', (req, res) => {
    const sql = 'INSERT INTO  tareas SET ?';

    const taskObj = {
        tarea: req.body.tarea,
        estado: 1,
        fechacreacion: new Date(),
        ultimaedicion: new Date()
    };

    connection.query(sql, taskObj, error => {
        if (error) throw error;
        res.send('Tarea agregada correctamente')

    });

});

//editar
app.put('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { tarea } = req.body;


    const sql = `UPDATE tareas  SET tarea = '${tarea}', ultimaedicion = CURTIME() WHERE id = ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Tarea editada correctamente')

    });
});
// cambiar estado
app.patch('/estado/:id', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    var est
    if (estado == 1) {
        est = 0;
    } else if (estado == 0) {
        est = 1;
    };
    const sql = `UPDATE tareas  SET estado = ${est} WHERE id = ${id}`;
    connection.query(sql, error => {
        if (error) throw error;
        res.send('Tarea editada correctamente');
    });
});

//eliminar tarea 
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM tareas WHERE id = ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Tarea eliminada correctamente')

    });
});


//check connection

connection.connect(error => {
    if (error) throw error;

    console.log('Database server running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
