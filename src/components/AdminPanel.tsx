import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';
import { PointOfSale } from '../types';
import { LogOut, Trash2, Edit2, Plus, X, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState<PointOfSale[]>([]);
  const [editingPoint, setEditingPoint] = useState<PointOfSale | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email !== 'julioapk.ja@gmail.com') {
        setError('Acesso negado. Apenas o administrador autorizado pode acessar.');
        signOut(auth);
      } else {
        setError('');
      }
    });

    const unsubscribePoints = onSnapshot(collection(db, 'pointsOfSale'), (snapshot) => {
      const pts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PointOfSale));
      setPoints(pts.sort((a, b) => a.name.localeCompare(b.name)));
    });

    return () => {
      unsubscribeAuth();
      unsubscribePoints();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== 'julioapk.ja@gmail.com') {
        await signOut(auth);
        setError('Acesso negado. Email não autorizado.');
      }
    } catch (error: any) {
      console.error(error);
      setError('Erro ao fazer login: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este ponto?')) {
      try {
        await deleteDoc(doc(db, 'pointsOfSale', id));
      } catch (err: any) {
        alert('Erro ao deletar: ' + err.message);
      }
    }
  };

  if (!user || user.email !== 'julioapk.ja@gmail.com') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
          <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-lilita text-2xl mb-2 text-gray-800">Área Restrita</h2>
          <p className="text-gray-500 mb-8 font-medium">Faça login para gerenciar os pontos de venda.</p>
          
          {error && <p className="text-red-500 text-sm font-bold mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
          
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-4xl min-h-[60vh] max-h-[90vh] flex flex-col shadow-2xl relative"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-lilita text-2xl text-gray-800">Painel de Administração</h2>
            <p className="text-sm font-bold text-gray-500">{user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => signOut(auth)}
              className="text-gray-500 hover:text-red-500 flex items-center gap-1 font-bold text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <AdminForm 
              point={editingPoint} 
              onSave={() => setEditingPoint(null)} 
              onCancel={() => setEditingPoint(null)} 
            />
          </div>
          
          <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-8">
            <h3 className="font-lilita text-xl mb-4 text-gray-800">Pontos Cadastrados ({points.length})</h3>
            <div className="space-y-3">
              {points.map(point => (
                <div key={point.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200">
                  <div>
                    <h4 className="font-bold text-gray-800">{point.name}</h4>
                    <p className="text-xs font-medium text-gray-500">{point.city} - {point.neighborhood}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingPoint(point)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => point.id && handleDelete(point.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AdminForm({ point, onSave, onCancel }: { point: PointOfSale | null, onSave: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<PointOfSale>({
    name: '',
    address: '',
    phone: '',
    city: '',
    neighborhood: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (point) {
      setFormData(point);
    } else {
      setFormData({ name: '', address: '', phone: '', city: '', neighborhood: '' });
    }
  }, [point]);

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    // Limita a 11 dígitos (DD + 9 + 8 dígitos)
    const truncated = numbers.slice(0, 11);

    // Aplica a máscara: (XX) X XXXX-XXXX
    if (truncated.length <= 2) return truncated.length > 0 ? `(${truncated}` : '';
    if (truncated.length <= 3) return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
    if (truncated.length <= 7) return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 3)} ${truncated.slice(3)}`;
    return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 3)} ${truncated.slice(3, 7)}-${truncated.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatPhone(e.target.value);
    setFormData({ ...formData, phone: masked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (point && point.id) {
        await updateDoc(doc(db, 'pointsOfSale', point.id), {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          city: formData.city,
          neighborhood: formData.neighborhood
        });
      } else {
        await addDoc(collection(db, 'pointsOfSale'), {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          city: formData.city,
          neighborhood: formData.neighborhood
        });
      }
      onSave();
      setFormData({ name: '', address: '', phone: '', city: '', neighborhood: '' });
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-lilita text-xl mb-4 text-gray-800">
        {point ? 'Editar Ponto' : 'Novo Ponto'}
      </h3>
      
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nome</label>
        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-0 outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Endereço</label>
        <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-0 outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Telefone</label>
        <input
          required
          type="text"
          placeholder="(31) 9 9999-9999"
          value={formData.phone}
          onChange={handlePhoneChange}
          className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-0 outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cidade</label>
        <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-0 outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Bairro</label>
        <input required type="text" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-0 outline-none transition-colors" />
      </div>

      <div className="pt-4 flex gap-3">
        <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        {point && (
          <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition-colors">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
