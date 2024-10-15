import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Volume2, VolumeX, Search, Edit, Trash2, Plus, Calendar, Phone, MapPin, X, Briefcase, Info, Check, Send } from 'lucide-react';
import useSound from 'use-sound';
import axios from 'axios';

export default function Component() {
  const [users, setUsers] = useState([]); // aqui inicia vacío
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');


  const [playHoverSound] = useSound('/hover.mp3', { volume: 0.5 });
  const [playClickSound] = useSound('/click.mp3', { volume: 0.5 });

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  const pageSize = 5;
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4001/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      console.log('respuesta de usuarios:', response.data.users);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
  fetchUsers();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditUser = (user) => {
    console.log('usuario a editar:', user);
    setEditingUser(user);
    const additionalFields = user.additionalFields && typeof user.additionalFields === 'object' 
    ? Object.entries(user.additionalFields).map(([key, value]) => ({ key, value })) 
    : [];

    setAdditionalFields(additionalFields);
    setIsAddUserOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    console.log("Usuario ID a eliminar:", userId); 
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:4001/api/user/${userId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('el usuario fue eliminado');
      await fetchUsers(); // para que actualice automaticamente
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Función para manejar la creación de un usuario
const handleCreateUser = async (userData) => {
  const additionalFieldsObject = additionalFields.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  const newUserData = {
    email: userData.email, 
    name: userData.name,
    role: userData.role,
    status: userData.status,
    phone: userData.phone,        
    location: userData.location,  
    dateJoined: userData.dateJoined, 
    company: userData.company,
    additionalFields: additionalFieldsObject,
  
  };

  const token = localStorage.getItem('token'); 
  if (!token) {
    console.error("Token no disponible. No estás autenticado.");
    return;
  }

  try {
    const response = await axios.post('http://localhost:4001/api/user', newUserData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Usuario creado:", response.data);
    // Actualizar el estado de usuarios
    setUsers([...users, response.data]);
  } catch (error) {
    console.error("Error creando el usuario:", error.response ? error.response.data : error.message);
    // Mostrar un mensaje adecuado si el error es un email duplicado
    if (error.response && error.response.data && error.response.data.error === 'El email ya está en uso') {
      alert("Este correo electrónico ya está registrado. Intenta con otro.");
    }
  }
};

// Función para manejar la actualización de un usuario
const handleUpdateUser = async (userData) => {
  const additionalFieldsObject = additionalFields.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  const updatedUserData = {
    email: userData.email,
    name: userData.name,
    role: userData.role,
    status: userData.status,
    additionalFields: additionalFieldsObject,
  };

  console.log("Datos de usuario a actualizar:", updatedUserData);

  const token = localStorage.getItem('token'); 
  if (!token) {
    console.error("Token no disponible. No estás autenticado.");
    return;
  }

  try {
    const response = await axios.put(`http://localhost:4001/api/user/${editingUser._id}`, updatedUserData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Usuario actualizado:", response.data);
    // Refrescar la lista de usuarios después de la actualización
    await fetchUsers();
  } catch (error) {
    console.error("Error actualizando el usuario:", error.response ? error.response.data : error.message);
  }
};

// Función principal para agregar o actualizar un usuario
const handleAddOrUpdateUser = async (userData) => {
  setIsLoading(true);
  try {
    if (editingUser && editingUser._id) {
      await handleUpdateUser(userData);
    } else {
      await handleCreateUser(userData);
    }
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
  } finally {
    setIsLoading(false); // Finaliza el estado de carga
    setIsAddUserOpen(false);
    setEditingUser(null);
    setAdditionalFields([]);
  }
};

  const handleMouseEnter = () => {
    if (isSoundEnabled) {
      playHoverSound();
    }
  };

  const handleButtonClick = () => {
    if (isSoundEnabled) {
      playClickSound();
    }
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { key: '', value: '' }]);
  };

  const handleRemoveField = (index) => {
    setAdditionalFields(additionalFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...additionalFields];
    newFields[index] = { ...newFields[index], [key]: value };
    setAdditionalFields(newFields);
  };

  const handleViewUserInfo = (user) => {
    setSelectedUser(user);
    setIsUserInfoOpen(true);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prevSelected => 
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleSendEmail = (userId) => {
    const selectedUser = users.find(user => user._id === userId);
  setEditingUser(selectedUser); 
  setIsEmailModalOpen(true); 
};

  const handleSubmitEmail = async () => {
     const emailData = {
      userId: editingUser?._id,
      subject: emailSubject,
      text: emailBody
     };

     console.log('datos de envios:', emailData);
    
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        console.error('No se encontró token. Debes iniciar sesión.');
        return;
      }
      
      const response = await axios.post('http://localhost:4001/api/send-email', emailData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Correo enviado exitosamente:', response.data);
      setIsEmailModalOpen(false);
  } catch (error) {
      console.error('Error al enviar el correo:', error);
  }
};


  return (
    <div className="admin-container">
      <motion.div 
        className="admin-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Gestión de Usuarios</h2>
        <div className="admin-controls">
          <div className="search-bar">
            <Search size={20} />
            <motion.input 
              whileFocus={{ scale: 1.05 }}
              type="text" 
              placeholder="Buscar usuarios..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar usuarios"
            />
          </div>
          <motion.button 
            className="add-user-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleMouseEnter}
            onClick={() => {
              handleButtonClick();
              setIsAddUserOpen(true);
            }}
          >
            <Plus size={20} />
            Añadir Usuario
          </motion.button>
        </div>
        <div className="user-table">
          <div className="table-header">
            <span>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                aria-label="Seleccionar todos los usuarios"
              />
            </span>
            <span>Nombre</span>
            <span>Email</span>
            <span>Rol</span>
            <span>Estado</span>
            <span>Empresa</span>
            <span>Acciones</span>
          </div>
          <AnimatePresence>
            {paginatedUsers.map((user) => (
              <motion.div
                key={user.id}
                className="table-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    aria-label={`Seleccionar ${user.name}`}
                  />
                </span>
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span className={`role ${user.role.toLowerCase()}`}>{user.role}</span>
                <span className={`status ${user.status.toLowerCase()}`}>{user.status}</span>
                <span>{user.company}</span>
                <span className="actions">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={handleMouseEnter}
                    onClick={() => {
                      handleButtonClick();
                      handleViewUserInfo(user);
                    }}
                    aria-label="Ver información del usuario"
                  >
                    <Info size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={handleMouseEnter}
                    onClick={() => {
                      handleButtonClick();
                      handleEditUser(user);
                    }}
                    aria-label="Editar usuario"
                  >
                    <Edit size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={handleMouseEnter}
                    onClick={() => {
                      console.log("ID del usuario a eliminar:", user._id);
                      handleButtonClick();
                      handleDeleteUser(user._id);
                    }}
                    aria-label="Eliminar usuario"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={handleMouseEnter}
                    onClick={() => {
                      handleButtonClick();
                      handleSendEmail(user._id);
                    }}
                    aria-label="Enviar correo al usuario"
                  >
                    <Send size={20} />
                  </motion.button>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="table-footer">
          <div className="pagination">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={handleMouseEnter}
              onClick={() => {
                handleButtonClick();
                handlePageChange(currentPage - 1);
              }}
              disabled={currentPage === 1}
            >
              Anterior
            </motion.button>
            <span>Página {currentPage} de {totalPages}</span>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={handleMouseEnter}
              onClick={() => {
                handleButtonClick();
                handlePageChange(currentPage + 1);
              }}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </motion.button>
          </div>
          <motion.button
            className="send-email-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleMouseEnter}
            onClick={() => {
              handleButtonClick();
              if (selectedUsers.length > 0) {
                handleSendEmail(selectedUsers[0]); 
            }
            }}
            disabled={selectedUsers.length === 0}
          >
            <Send size={20} />
            Enviar Correo ({selectedUsers.length})
          </motion.button>
        </div>
      </motion.div>
      {isAddUserOpen && (
        <div className="modal-overlay">
          <motion.div 
            className="modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{editingUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role'),
                status: formData.get('status') === 'on' ? 'Active' : 'Inactive',
                phone: formData.get('phone'),
                location: formData.get('location'),
                dateJoined: formData.get('dateJoined'),
                company: formData.get('company')
              };
              handleAddOrUpdateUser(userData);
            }}>
              <div className="input-group">
                <User size={20} />
                <motion.input 
                  whileFocus={{ scale: 1.05 }}
                  type="text" 
                  name="name"
                  placeholder="Nombre completo" 
                  defaultValue={editingUser?.name}
                  required
                  aria-label="Nombre completo"
                />
              </div>
              <div className="input-group">
                <Mail size={20} />
                <motion.input 
                  whileFocus={{ scale: 1.05 }}
                  type="email" 
                  name="email"
                  placeholder="Correo electrónico" 
                  defaultValue={editingUser?.email}
                  required
                  aria-label="Correo electrónico"
                />
              </div>
              <div className="input-group">
                <Lock size={20} />
                <motion.select
                  whileFocus={{ scale: 1.05 }}
                  name="role"
                  defaultValue={editingUser?.role || 'user'}
                  required
                  aria-label="Rol"
                >
                  <option value="user">Usuario</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </motion.select>
              </div>
              <div className="input-group">
                <Phone size={20} />
                <motion.input 
                  whileFocus={{ scale: 1.05 }}
                  type="tel" 
                  name="phone"
                  placeholder="Teléfono" 
                  defaultValue={editingUser?.phone}
                  required
                  aria-label="Teléfono"
                />
              </div>
              <div className="input-group">
                <MapPin size={20} />
                <motion.input 
                  whileFocus={{ scale: 1.05 }}
                  type="text" 
                  name="location"
                  placeholder="Ubicación" 
                  defaultValue={editingUser?.location}
                  required
                  aria-label="Ubicación"
                />
              </div>
              <div className="input-group">
                <Briefcase size={20} />
                <motion.input 
                  whileFocus={{ scale: 1.05 }}
                  type="text" 
                  name="company"
                  placeholder="Empresa" 
                  defaultValue={editingUser?.company}
                  required
                  aria-label="Empresa"
                />
              </div>
              <div className="input-group">
                <Calendar size={20} />
                <motion.input 
                  whileFocus={{ scale: 1.05 }}
                  type="date" 
                  name="dateJoined"
                  placeholder="Fecha de ingreso" 
                  defaultValue={editingUser?.dateJoined || new Date().toISOString().split('T')[0]}
                  required
                  aria-label="Fecha de ingreso"
                />
              </div>
              <div className="input-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="status"
                    defaultChecked={editingUser?.status === 'Active'}
                  />
                  <span>Activo</span>
                </label>
              </div>
              {additionalFields.map((field, index) => (
                <div key={index} className="input-group additional-field">
                  <motion.input
                    whileFocus={{ scale: 1.05 }}
                    type="text"
                    placeholder="Nombre del campo"
                    value={field.key}
                    onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                    aria-label={`Nombre del campo adicional ${index + 1}`}
                  />
                  <motion.input
                    whileFocus={{ scale: 1.05 }}
                    type="text"
                    placeholder="Valor del campo"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                    aria-label={`Valor del campo adicional ${index + 1}`}
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveField(index)}
                    aria-label={`Eliminar campo adicional ${index + 1}`}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              ))}
              <motion.button
                type="button"
                className="add-field-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddField}
              >
                <Plus size={20} />
                Añadir Campo
              </motion.button>
              <motion.button 
                className="submit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={handleMouseEnter}
                onClick={handleAddOrUpdateUser}
                type="submit"
              >
                {isLoading ? (
                  <div className="loading-spinner" />
                ) : (
                  <>
                    {editingUser ? 'Actualizar' : 'Añadir'} <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>
            <motion.button 
              className="close-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={handleMouseEnter}
              onClick={() => {
                handleButtonClick();
                setIsAddUserOpen(false);
                setEditingUser(null);
                setAdditionalFields([]);
              }}
            >
              &times;
            </motion.button>
          </motion.div>
        </div>
      )}
      {isUserInfoOpen && selectedUser && (
        <div className="modal-overlay">
          <motion.div 
            className="modal user-info-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Información del Usuario</h3>
            <div className="user-info">
              <p><strong>Nombre:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Rol:</strong> {selectedUser.role}</p>
              <p><strong>Estado:</strong> {selectedUser.status}</p>
              <p><strong>Teléfono:</strong> {selectedUser.phone}</p>
              <p><strong>Ubicación:</strong> {selectedUser.location}</p>
              <p><strong>Empresa:</strong> {selectedUser.company}</p>
              <p><strong>Fecha de Ingreso:</strong> {selectedUser.dateJoined}</p>
              {selectedUser.additionalFields && Object.entries(selectedUser.additionalFields).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
            </div>
            <motion.button 
              className="close-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={handleMouseEnter}
              onClick={() => {
                handleButtonClick();
                setIsUserInfoOpen(false);
                setSelectedUser(null);
              }}
            >
              &times;
            </motion.button>
          </motion.div>
        </div>
      )}
      {isEmailModalOpen && (
        <div className="modal-overlay">
          <motion.div 
            className="modal email-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Enviar Correo</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmitEmail();
            }}>
              <div className="input-group">
                <label htmlFor="email-subject">Asunto:</label>
                <motion.input 
                  id="email-subject"
                  whileFocus={{ scale: 1.05 }}
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                  aria-label="Asunto del correo"
                />
              </div>
              <div className="input-group">
                <label htmlFor="email-body">Mensaje:</label>
                <motion.textarea 
                  id="email-body"
                  whileFocus={{ scale: 1.05 }}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  required
                  aria-label="Cuerpo del correo"
                />
              </div>
              <motion.button 
                className="submit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={handleMouseEnter}
                onClick={handleButtonClick}
                type="submit"
              >
                Enviar Correo <Send size={20} />
              </motion.button>
            </form>
            <motion.button 
              className="close-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={handleMouseEnter}
              onClick={() => {
                handleButtonClick();
                setIsEmailModalOpen(false);
              }}
            >
              &times;
            </motion.button>
          </motion.div>
        </div>
      )}
      <motion.button
        className="sound-toggle"
        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          backgroundColor: isSoundEnabled ? "rgba(243, 63, 49, 0.8)" : "rgba(255, 255, 255, 0.1)",
        }}
        aria-label={isSoundEnabled ? "Desactivar sonido" : "Activar sonido"}
      >
        {isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>
      <style jsx>{`
        .admin-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          background-color: #0a0a0a;
          padding: 2rem;
          position: relative;
        }

        .admin-card {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 3rem;
          width: 100%;
          max-width: 1200px;
          box-shadow: 0 15px 40px rgba(243, 63, 49, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        h2, h3 {
          color: #ffffff;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 300;
          letter-spacing: 1px;
          background: linear-gradient(45deg, #F33F31, #E77171);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .search-bar {
          position: relative;
          flex-grow: 1;
          margin-right: 1rem;
        }

        .search-bar svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #b0b0b0;
        }

        .search-bar input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-bar input:focus {
          outline: none;
          border-color: #F33F31;
          box-shadow: 0 0 0 2px rgba(243, 63, 49, 0.2);
        }

        .add-user-button, .add-field-button, .send-email-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #F33F31, #E77171);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-field-button {
          width: 100%;
          margin-top: 1rem;
          background: rgba(255, 255, 255, 0.1);
        }

        .send-email-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .user-table {
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          overflow: hidden;
        }

        .table-header, .table-row {
          display: grid;
          grid-template-columns: 0.5fr 2fr 2fr 1fr 1fr 1fr 1.5fr;
          padding: 1rem;
          align-items: center;
        }

        .table-header {
          background-color: rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }

        .table-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-header span, .table-row span {
          color: #ffffff;
        }

        .role, .status {
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          text-align: center;
          font-size: 0.9rem;
        }

        .role.admin {
          background-color: rgba(243, 63, 49, 0.2);
          color: #F33F31;
        }

        .role.editor {
          background-color: rgba(255, 193, 7, 0.2);
          color: #FFC107;
        }

        .role.user {
          background-color: rgba(33, 150, 243, 0.2);
          color: #2196F3;
        }

        .status.active {
          background-color: rgba(76, 175, 80,
          0.2);
          color: #4CAF50;
        }

        .status.inactive {
          background-color: rgba(158, 158, 158, 0.2);
          color: #9E9E9E;
        }

        .actions {
          display: flex;
          justify-content: space-around;
        }

        .actions button {
          background: none;
          border: none;
          color: #b0b0b0;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .actions button:hover {
          color: #F33F31;
        }

        .table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
        }

        .pagination {
          display: flex;
          align-items: center;
        }

        .pagination button {
          padding: 0.5rem 1rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination span {
          color: #b0b0b0;
          margin: 0 1rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background-color: #1a1a1a;
          border-radius: 20px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }

        .user-info-modal, .email-modal {
          max-width: 600px;
        }

        .user-info p, .email-modal label {
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .modal h3 {
          color: #ffffff;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .modal .input-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .modal .input-group svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #b0b0b0;
        }

        .modal input, .modal select, .modal textarea {
          width: 100%;
          padding: 1rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .modal textarea {
          min-height: 150px;
          resize: vertical;
        }

        .modal input:focus, .modal select:focus, .modal textarea:focus {
          outline: none;
          border-color: #F33F31;
          box-shadow: 0 0 0 2px rgba(243, 63, 49, 0.2);
        }

        .modal .checkbox {
          display: flex;
          align-items: center;
        }

        .modal .checkbox label {
          display: flex;
          align-items: center;
          color: #ffffff;
          font-size: 1rem;
          cursor: pointer;
        }

        .modal .checkbox input {
          margin-right: 0.5rem;
          width: auto;
        }

        .additional-field {
          display: flex;
          gap: 0.5rem;
        }

        .additional-field input {
          padding: 1rem;
        }

        .additional-field button {
          background: none;
          border: none;
          color: #F33F31;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(45deg, #F33F31, #E77171);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-button:hover {
          color: #F33F31;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .sound-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .sound-toggle:hover {
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 1200px) {
          .admin-card {
            padding: 2rem;
          }

          .table-header, .table-row {
            grid-template-columns: 0.5fr 2fr 2fr 1fr 1fr 1.5fr;
          }

          .table-header span:nth-child(6),
          .table-row span:nth-child(6) {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .admin-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-bar {
            margin-right: 0;
            margin-bottom: 1rem;
          }

          .add-user-button {
            width: 100%;
          }

          .table-header, .table-row {
            grid-template-columns: 0.5fr 2fr 1fr 1.5fr;
          }

          .table-header span:nth-child(3),
          .table-row span:nth-child(3),
          .table-header span:nth-child(5),
          .table-row span:nth-child(5),
          .table-header span:nth-child(6),
          .table-row span:nth-child(6) {
            display: none;
          }

          .table-footer {
            flex-direction: column;
            gap: 1rem;
          }

          .sound-toggle {
            bottom: 1rem;
            right: 1rem;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}