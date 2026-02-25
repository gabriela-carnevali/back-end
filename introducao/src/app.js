import express from 'express'

const app = express()

app.use(express.json())

const musicas = [
    {
        id: 123,
        titulo: "B.Y.O.B",
        artista: "System of Down",
        genero: "POP",
        ano_publicacao: 1998
    },
    {
        id: 456,
        titulo: "Autumn",
        artista: "Couch",
        genero: "R&B",
        ano_publicacao: 2020
    }
]

function buscarMusica (id) {
    return musicas.findIndex(m => {
        return m.id === Nunmber (id)
    })
}

app.get ('/musicas', (req,res) => {
    res.status (200).json (musicas)
})
8
export default app