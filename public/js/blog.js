const newFormHandler = async (event) => {
  event.preventDefault()
    const title = document.querySelector('#comment-title').value.trim();
    const content = document.querySelector('#comment-cont').value.trim();
  
    if (title  && content) {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ title,  content,}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        
      } else {
        alert('Failed to create comment');
      }
    }
  };

  const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
  
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to delete comment');
      }
    }
  };
  
  document
    .querySelector('.new-comment-form')
    .addEventListener('submit', newFormHandler);
  
  document
    .querySelector('.comment-list')
    .addEventListener('click', delButtonHandler);
 