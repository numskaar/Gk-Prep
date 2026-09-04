const s = document.createElement('script');
s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
s.onload = init;
document.head.appendChild(s);

let client, editingId = null;

function init(){
  if(!window.GK_CONFIG || GK_CONFIG.SUPABASE_URL.includes("YOUR-")){
    document.querySelector('#loginMsg').textContent='पहले config.js में Supabase credentials भरें।';
    return;
  }
  client = supabase.createClient(GK_CONFIG.SUPABASE_URL, GK_CONFIG.SUPABASE_ANON_KEY);
  wire();
  checkSession();
}
function wire(){
  document.querySelector('#loginForm').addEventListener('submit', login);
  document.querySelector('#logout').addEventListener('click', async()=>{await client.auth.signOut(); showLogin();});
  document.querySelector('#postForm').addEventListener('submit', savePost);
  document.querySelector('#cancelEdit').addEventListener('click', resetForm);
}
async function checkSession(){
  const {data}=await client.auth.getSession();
  data.session ? showApp() : showLogin();
}
function showLogin(){document.querySelector('#loginView').classList.remove('hidden');document.querySelector('#app').classList.add('hidden')}
function showApp(){document.querySelector('#loginView').classList.add('hidden');document.querySelector('#app').classList.remove('hidden');loadPosts()}
async function login(e){
  e.preventDefault();
  const email=document.querySelector('#email').value,password=document.querySelector('#password').value;
  const {error}=await client.auth.signInWithPassword({email,password});
  document.querySelector('#loginMsg').textContent=error?error.message:'';
  if(!error) showApp();
}
async function loadPosts(){
  const {data,error}=await client.from('current_affairs').select('*').order('date',{ascending:false});
  if(error){document.querySelector('#posts').textContent=error.message;return}
  document.querySelector('#totalPosts').textContent=data.length;
  document.querySelector('#publishedPosts').textContent=data.filter(x=>x.published).length;
  document.querySelector('#posts').innerHTML=data.map(p=>`<article class="post"><h3>${esc(p.title)}</h3><small>${esc(p.date)} · ${esc(p.category)} · ${p.published?'Published':'Draft'}</small><p>${esc(p.summary||'')}</p><button onclick="editPost('${p.id}')">Edit</button><button class="danger" onclick="deletePost('${p.id}')">Delete</button></article>`).join('')||'<p>No posts yet.</p>';
  window._posts=data;
}
async function savePost(e){
  e.preventDefault();
  const payload={title:title.value,category:category.value,date:date.value,image:image.value,summary:summary.value,content:content.value,published:published.checked};
  const q=editingId?client.from('current_affairs').update(payload).eq('id',editingId):client.from('current_affairs').insert(payload);
  const {error}=await q;
  formMsg.textContent=error?error.message:'Saved successfully.';
  if(!error){resetForm();loadPosts()}
}
window.editPost=(id)=>{
  const p=window._posts.find(x=>x.id===id); if(!p)return;
  editingId=id; postId.value=id; title.value=p.title; category.value=p.category; date.value=p.date; image.value=p.image||''; summary.value=p.summary||''; content.value=p.content||''; published.checked=!!p.published;
  formTitle.textContent='Edit Current Affair'; cancelEdit.classList.remove('hidden'); scrollTo(0,0);
};
window.deletePost=async(id)=>{
  if(!confirm('Delete this post?'))return;
  const {error}=await client.from('current_affairs').delete().eq('id',id);
  if(error)alert(error.message); else loadPosts();
};
function resetForm(){editingId=null;postForm.reset();published.checked=true;formTitle.textContent='Add Current Affair';cancelEdit.classList.add('hidden');formMsg.textContent=''}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
