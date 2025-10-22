// Vercel Serverless Function
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Backend está funcionando!',
    timestamp: new Date().toISOString()
  });
}


