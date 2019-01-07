const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const expressSanitizer = require('express-sanitizer')

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true })
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer()) // it needs to go AFTER bodyParser
app.use(methodOverride('_method'))


// MOONGOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

const Blog = mongoose.model('Blog', blogSchema)






// RESTFUL ROUTES

app.get('/', function(req, res){
    res.redirect('/blogs')

})

// INDEX ROUTE
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log('ERROR!!!');   
        } else {
            res.render('index', {blogs: blogs})
        }
    })
})

// NEW ROUTE
app.get('/blogs/new', function(req, res){
    res.render('new')
})

// CREATE ROUTE
app.post('/blogs', function(req, res){
    // create blog
    console.log(req.body);
    
    req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new')
        } else {
            // redirect to the index            
            res.redirect('/blogs')
        }
    })
})

// SHOW ROUTE
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs')
        } else {
            res.render('show', {blog: foundBlog})
        }
    })
})

// EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs')
        } else {
            res.render('edit', {blog: foundBlog})
        }
    })
})

// UPDATE ROUTE
app.put('/blogs/:id', function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect('/blogs')
        } else {
            res.redirect(`/blogs/${req.params.id}`)
        }
    })
})

// DELETE ROUTE
app.delete('/blogs/:id', function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs')
        }
    })
})





app.listen(3000, 'localhost', function() {
    console.log('RESTful blog app server has started, listening on port 3000, you weirdo!!!');
})