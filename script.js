const express = require('express')
const bodyParser = require('body-parser')
const { createClient } = require('@libsql/client')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const db = createClient({
    url: "libsql://2205-oldskull27.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTY0MjIzMDksImlkIjoiODc1YTBlNDMtZDZjNy00YjU2LWI1NjEtYTNiYzJkODcyNzM1In0.PC91D6a7UgZgC1w8a_z0Nt1pmAumMX64ObZleVl2ZBd8vERul0SoxjFKv4r8pXIoQQv7FQioiRPeyNWDEV9UAw",
  });


app.set('port', process.env.PORT || 3000); 

app.get('/', (req, res) => {
    res.json(
        {
            "Title": "API works"
        }
    );
});

app.get('/users', async (req, res) => {
    const result = await db.execute("SELECT * FROM Productos;");
    res.json(result.rows);
});

app.post('/user', async (req, res) => {
    console.log(req.body);
    const value = await db.execute(`INSERT INTO Productos (titulo, precio, descripcion, imagen ) VALUES ('${req.body.titulo}', '${req.body.precio}', '${req.body.descripcion}', '${req.body.imagen}');`);
    res.json({ "message": value });
}); 

app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;
    const value = await db.execute(`DELETE FROM Productos WHERE id = ${id};`);
    res.json({ "message": "User deleted" });
});

app.put('/users/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { titulo, precio, descripcion, imagen } = req.body;
  
      const value = await db.execute(`
        UPDATE Productos
        SET titulo = '${titulo}',
            precio = '${precio}',
            descripcion = '${descripcion}',
            imagen = '${imagen}'
        WHERE id = ${id};
      `);
  
      if (value.rowsAffected === 0) {
        res.status(404).json({ message: 'Producto no encontrado' });
      } else {
        res.json({ message: 'Producto actualizado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el producto' });
    }
  });
  

app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});
