// This is the database that we will sync across clients using IPFS or some
// other tech. We can later create a per-client database for UI state & other
// such data, if convenient.

import createDatabase from '../database'

export const initialState = {
  publications: {},
  publicationOrder: [],
}

const db = createDatabase({name: 'syncedDB', initialState})

export default db

export const saveImage = str =>
  db.addBase64File(str)
    .then(id => db.fetchData()
      .then(data =>
        db.setData({
          ...data,
          publications: {
            ...data.publications,
            [id]: { id, src: `https://ipfs.io/ipfs/${id}`},
          },
          publicationOrder: [ id, ...data.publicationOrder ],
        })))


export const deleteImage = id =>
  db.fetchData()
    .then(data => {
      const { [id]: p, ...rest } = data.publications
      db.setData({
        ...data,
        publications: rest,
        publicationOrder: data.publicationOrder.filter(i => i !== id)
      })
    })
