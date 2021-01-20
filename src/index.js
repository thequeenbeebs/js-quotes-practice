

document.addEventListener('DOMContentLoaded', () => {
    fetchQuotes()
    formSubmit()
})

const fetchQuotes = () => {
    document.getElementById("quote-list").innerText = ""
    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(resp => resp.json())
        .then(quotes => quotes.forEach(renderQuote))
}

const renderQuote = (quote) => {
    let quoteContainer = document.getElementById("quote-list")

    let quoteCard = document.createElement('li')
        quoteCard.classList.add('quote-card')

    let blockquote = document.createElement('blockquote')
        blockquote.classList.add('blockquote')
    
    let p = document.createElement('p')
        p.classList.add('mb-0')
        p.innerText = quote.quote

    let footer = document.createElement('footer')
        footer.classList.add('blockquote-footer')
        footer.innerText = quote.author
    
    let br = document.createElement('br')

    let likeBtn = document.createElement('button')
        likeBtn.classList.add('btn-success')
        likeBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`
        likeBtn.addEventListener('click', () => likeQuote(quote, likeBtn))

    let editBtn = document.createElement('button')
        editBtn.classList.add("btn-warning")
        editBtn.innerHTML = "Edit"
        editBtn.addEventListener('click', () => editForm.classList.remove('invisible'))

    let deleteBtn = document.createElement('button')
        deleteBtn.classList.add('btn-danger')
        deleteBtn.innerText = "Delete"
        deleteBtn.addEventListener('click', (event) => {
            event.target.parentElement.parentElement.remove()
            deleteQuote(quote)
        })
    
    let editForm = document.createElement('form')
        editForm.classList.add('invisible')
        editForm.addEventListener('submit', (event) => {
            editQuote(event, quote)
        })

    let br2 = document.createElement('br')

    let quoteDiv = document.createElement('div')
        quoteDiv.classList.add('form-group')
    let quoteLabel = document.createElement('label')
        quoteLabel.innerText = "Quote"
    let quoteInput = document.createElement('input')
        quoteInput.name = "quote"
        quoteInput.type = "text"
        quoteInput.classList.add('form-control')
        quoteInput.value = quote.quote

    let authorDiv = document.createElement('div')
        authorDiv.classList.add('form-group')
    let authorLabel = document.createElement('label')
        authorLabel.innerText = "Author"
    let authorInput = document.createElement('input')
        authorInput.name = "author"
        authorInput.type = "text"
        authorInput.classList.add('form-control')
        authorInput.value = quote.author

    let submit = document.createElement('button')
        submit.type = "submit"
        submit.classList.add('btn')
        submit.classList.add('btn-primary')
        submit.innerText = "Submit"

    authorDiv.append(authorLabel, authorInput)
    quoteDiv.append(quoteLabel, quoteInput)
    editForm.append(br2, quoteDiv, authorDiv, submit)
    blockquote.append(p, footer, br, likeBtn, editBtn, deleteBtn, editForm)
    quoteCard.append(blockquote)
    quoteContainer.append(quoteCard)
}

const formSubmit = () => {
    document.getElementById('new-quote-form').addEventListener('submit', (event) => {
        event.preventDefault()
        let newQuote = {
            quote: event.target.quote.value,
            author: event.target.author.value,
            likes: []
        }

        let reqPack = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            method: "POST",
            body: JSON.stringify(newQuote)
        }

        fetch('http://localhost:3000/quotes', reqPack)
            .then(resp => resp.json())
            .then(quote => renderQuote(quote))
    })
}

const deleteQuote = (quote) => {
    let reqPack = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "DELETE"
    }

    fetch(`http://localhost:3000/quotes/${quote.id}`, reqPack)
    
}

const likeQuote = (quote, likeBtn) => {
    let newLike = { 
        quoteId: quote.id,
        createdAt: Date.now()
     }

    let reqPack = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "POST",
        body: JSON.stringify(newLike)
    }

    fetch(`http://localhost:3000/likes`, reqPack)
        .then(resp => resp.json())
        .then(like => {
            quote.likes.push(like)
            likeBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`
        })
}

const editQuote = (event, quote) => {
    event.preventDefault()
    
    let editedQuote = {
        quote: event.target.quote.value,
        author: event.target.author.value,
    }

    let reqPack = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify(editedQuote)
    }

    fetch(`http://localhost:3000/quotes/${quote.id}`, reqPack)
        .then(resp => resp.json())
        .then(quote => fetchQuotes())
}

//make sort toggle button

