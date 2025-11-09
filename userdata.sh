
**Backend Setup:**(open terminal and copy and paste)
   
   cd backend
   python -m venv venv
   venv/scripts/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   

2. **Frontend Setup:**( add new terminal cp and paste)
   
   cd frontend
   npm install
   npm run dev
   