const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json()) //obtener datos que envia el usuario
app.use(cors())

 const requestLogger=(request,response, next) => {
 console.log('Method',request.method);
 console.log('path',request.path);
 console.log('body',request.body);
 console.log('----');
 next()
 }

 app.use (requestLogger)
let notes = [
        {
        id: 1,
        content: "HTML is easy",
        important: true
        },
        {
        id: 2,
        content: "Browser can execute only javascript",
        important: false
        },
        {
        id: 3,
        content: "GET and POST are the most important methods of HTTP Protocol",
        important: true
        }
    ]
 
    app.get('/',(request,response) => {
        response.send('<h1>API REST FROM NOTES</h1>')
    })
    app.get('/api/notes',(request,response) => {
        response.json(notes)
    })
    app.get('/api/notes/:id',(request,response) => {
        const id = Number(request.params.id)
        //console.log('id:',id);
        const note = notes.find(n => n.id === id)
       // console.log(note);
        if(note) {
            response.json(note)
        }
        else {
            response.status(404).end()
        }
    })
    app.delete('/api/notes/:id',(request,response) => {
        const id = Number(request.params.id)
       // console.log('Delete id:',id);
        notes=notes.filter(n => n.id !== id)
        response.status(204).end()
    })
 
    const generateId = () => {
        const maxId = notes.length > 0
            ? Math.max(...notes.map(n => n.id))
            : 0
        return maxId + 1
    }
 
    app.post('/api/notes',(request,response) => { //agrega notas
        const body = request.body
        if (!body.content){
            return response.status(400).json({
                error: 'Content missing'
            })
        }
        const note = {
            id: generateId(),
            content: body.content,
            important: Boolean(body.important) || false
        }
        notes = notes.concat(note)
        response.json(note)
    })
 
    const PORT = 3001
    app.listen(PORT, () => {
        console.log(`Server express running on port ${PORT}`);
    })

    // Ruta PUT para actualizar una nota existente
    app.put('/api/notes/:id', (request, response) => {
        const id = Number(request.params.id)
        const { content, important } = request.body
 
        // Buscar la nota con el id proporcionado
        const noteIndex = notes.findIndex(n => n.id === id)
 
        if (noteIndex === -1) {
        // Si la nota no existe, respondemos con un error 404
        return response.status(404).json({ error: 'Note not found' })
        }
 
        // Si la nota existe, actualizamos sus campos
        const updatedNote = {
            id: id,
            content: content || notes[noteIndex].content,  // Si no se proporciona contenido, mantenemos el original
            important: important !== undefined ? important : notes[noteIndex].important // Si no se proporciona, mantenemos el valor original
        }
 
        // Reemplazar la nota en el arreglo
        notes[noteIndex] = updatedNote
 
        // Responder con la nota actualizada
        response.json(updatedNote)
    })
//tiene menú contextual