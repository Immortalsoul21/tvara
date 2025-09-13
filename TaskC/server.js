require('dotenv').config({ path: '.env.local' })
const express = require('express')
const cors = require('cors')
const { supabase } = require('./lib/supabase')
const { validateInterviewTest } = require('./lib/validation')


const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Debug middleware
app.use((req, res, next) => {
  console.log(`=== ${req.method} ${req.path} ===`)
  console.log('Body:', req.body)
  console.log('Query:', req.query)
  next()
})

// GET /api/interview-tests
app.get('/api/interview-tests', async (req, res) => {
  try {
    const { field_3, field_2_min, field_2_max } = req.query
    
    let query = supabase.from('Interview_Tests').select('*')
    
    if (field_3 !== undefined) {
      query = query.eq('field_3', field_3 === 'true')
    }
    
    if (field_2_min !== undefined) {
      query = query.gte('field_2', parseInt(field_2_min))
    }
    
    if (field_2_max !== undefined) {
      query = query.lte('field_2', parseInt(field_2_max))
    }
    
    const { data, error } = await query
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/interview-tests
app.post('/api/interview-tests', async (req, res) => {
  console.log('=== POST REQUEST DEBUG ===')
  console.log('Request body:', JSON.stringify(req.body, null, 2))
  
  try {
    const { name, field_1, field_2, field_3 } = req.body
    console.log('Extracted fields:', { name, field_1, field_2, field_3 })
    
    if (!name) {
      console.log('ERROR: Name is missing')
      return res.status(400).json({ error: 'name is required' })
    }
    
    const validationErrors = validateInterviewTest(req.body)
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(', ') })
    }
    
    const insertData = { name }
    if (field_1 !== undefined) insertData.field_1 = field_1
    if (field_2 !== undefined) insertData.field_2 = parseInt(field_2)
    if (field_3 !== undefined) insertData.field_3 = field_3
    
    const { data, error } = await supabase
      .from('Interview_Tests')
      .insert(insertData)
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: error.message })
    }
    
    console.log('SUCCESS: Data inserted')
    return res.status(201).json(data[0])
  } catch (error) {
    console.error('Server error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/interview-tests/:id
app.get('/api/interview-tests/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const { data, error } = await supabase
      .from('Interview_Tests')
      .select('*')
      .eq('id', parseInt(id))
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Record not found' })
      }
      return res.status(500).json({ error: error.message })
    }
    
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/interview-tests/:id
app.put('/api/interview-tests/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, field_1, field_2, field_3 } = req.body
    
    const validationErrors = validateInterviewTest(req.body)
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(', ') })
    }
    
    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (field_1 !== undefined) updateData.field_1 = field_1
    if (field_2 !== undefined) updateData.field_2 = parseInt(field_2)
    if (field_3 !== undefined) updateData.field_3 = field_3
    
    const { data, error } = await supabase
      .from('Interview_Tests')
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Record not found' })
    }
    
    return res.status(200).json(data[0])
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/interview-tests/:id
app.delete('/api/interview-tests/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const { error } = await supabase
      .from('Interview_Tests')
      .delete()
      .eq('id', parseInt(id))
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    return res.status(204).end()
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})