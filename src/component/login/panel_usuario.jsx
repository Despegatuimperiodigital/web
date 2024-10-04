import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, MoreVertical, Plus, Search, ChevronLeft, ChevronRight, X, Calendar, Link, Image as ImageIcon, XCircle, MessageSquare, BarChart2, PieChart, TrendingUp, Clock } from 'lucide-react';
import axios from 'axios';

// Componente para el gráfico de barras
const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <div className="bar-chart">
      {data.map((item, index) => (
        <div key={index} className="bar-item">
          <div className="bar" style={{ height: `${(item.value / maxValue) * 100}%` }}></div>
          <div className="bar-label">{item.label}</div>
        </div>
      ))}
      <style jsx>{`
        .bar-chart {
          display: flex;
          align-items: flex-end;
          height: 200px;
          padding: 10px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .bar-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .bar {
          width: 30px;
          background-color: #F33F31;
          margin-bottom: 5px;
          border-radius: 5px 5px 0 0;
        }
        .bar-label {
          font-size: 0.8rem;
          color: #b0b0b0;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

// Componente para el gráfico circular
const PieChart2 = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;

  return (
    <div className="pie-chart">
      <svg viewBox="0 0 100 100">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const endAngle = startAngle + angle;
          const largeArcFlag = angle > 180 ? 1 : 0;
          const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
          const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

          const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

          startAngle = endAngle;

          return <path key={index} d={pathData} fill={item.color} />;
        })}
      </svg>
      <div className="legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <div className="color-box" style={{ backgroundColor: item.color }}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .pie-chart {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        svg {
          width: 150px;
          height: 150px;
        }
        .legend {
          margin-left: 20px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }
        .color-box {
          width: 12px;
          height: 12px;
          margin-right: 5px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Media',
    status: 'pending',
    assignedTo: '',
    tags: [],
    link: '',
    images: [],
    comments: []
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [newComment, setNewComment] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4005/api/tickets');
      setTasks(response.data.tickets);
      console.log(response.data.tickets)
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    }
  };

  const createTask = async (newTask) => {
    try {
      const ticketData = {
        title: newTask.title,
        description: newTask.description,
        priority:  newTask.priority === 'Baja' ? 'low' : 
        newTask.priority === 'Media' ? 'medium' : 
        newTask.priority === 'Alta' ? 'high' : 'medium',
        assignedTo: newTask.assignedTo || null,
        dueDate: newTask.dueDate || null,
      };
      const response = await axios.post('http://localhost:4005/api/tickets', {ticket: ticketData});
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const getTaskById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4005/api/tickets/${id}`);
      setSelectedTask(response.data.ticket);
    } catch (error) {
      console.error('Error al obtener tarea por ID:', error);
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:4005/api/tickets/${updatedTask.id}`, updatedTask);
      setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4005/api/tickets/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const completeTask = async (id) => {
    const updatedTask = tasks.find((task) => task.id === id);
    updatedTask.status = 'completed';
    await updateTask(updatedTask);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
    setNewComment('');
  };

  const openAddTaskForm = () => {
    setIsAddingTask(true);
  };

  const closeAddTaskForm = () => {
    setIsAddingTask(false);
    setNewTask({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Media',
      status: 'pending',
      assignedTo: '',
      tags: [],
      link: '',
      images: [],
      comments: []
    });
    setErrors({});
  };

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleTagToggle = (tag) => {
    setNewTask((prevTask) => ({
      ...prevTask,
      tags: prevTask.tags.includes(tag)
        ? prevTask.tags.filter((t) => t !== tag)
        : [...prevTask.tags, tag]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setNewTask((prevTask) => ({ ...prevTask, images: [...prevTask.images, ...newImages] }));
  };

  const removeImage = (index) => {
    setNewTask((prevTask) => ({
      ...prevTask,
      images: prevTask.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newTask.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!newTask.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!newTask.dueDate) {
      newErrors.dueDate = 'La fecha límite es requerida';
    }
    if (newTask.link && !isValidUrl(newTask.link)) {
      newErrors.link = 'El enlace no es válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const addNewTask = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await createTask(newTask);
      closeAddTaskForm();
    }
  };

  const addComment = () => {
    if (newComment.trim() === '') return;

    const comment = {
      id: selectedTask.comments.length + 1,
      author: 'Usuario Actual', // Esto debería ser reemplazado por el nombre del usuario autenticado
      content: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedTask = {
      ...selectedTask,
      comments: [...selectedTask.comments, comment]
    };

    updateTask(updatedTask);

    setSelectedTask(updatedTask);
    setNewComment('');
  };

  return (
    <div className="user-dashboard" Style="padding-top:110px;">
      <header className="dashboard-header">
        <h1>Panel de Usuario</h1>
        <div className="user-info">
          <img src="/placeholder.svg?height=40&width=40" alt="Avatar del usuario" className="user-avatar" />
          <span className="user-name">Juan Pérez</span>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <nav>
            <ul>
              <li>
                <a href="#" className={!showDashboard ? 'active' : ''} onClick={() => setShowDashboard(false)}>
                  Tareas
                </a>
              </li>
              <li>
                <a href="#" className={showDashboard ? 'active' : ''} onClick={() => setShowDashboard(true)}>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#">Proyectos</a>
              </li>
              <li>
                <a href="#">Calendario</a>
              </li>
              <li>
                <a href="#">Informes</a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          {showDashboard ? (
            <div className="statistics-dashboard">
              <h2>Dashboard de Estadísticas</h2>
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <h3>
                    <BarChart2 size={20} /> Estado de Tareas
                  </h3>
                  <BarChart
                    data={[
                      { label: 'Pendientes', value: tasks.filter((t) => t.status === 'pending').length },
                      { label: 'Completadas', value: tasks.filter((t) => t.status === 'completed').length }
                    ]}
                  />
                </div>
                <div className="dashboard-card">
                  <h3>
                    <PieChart size={20} /> Prioridad de Tareas
                  </h3>
                  <PieChart2
                    data={[
                      { label: 'Alta', value: tasks.filter((t) => t.priority === 'Alta').length, color: '#F44336' },
                      { label: 'Media', value: tasks.filter((t) => t.priority === 'Media').length, color: '#FF9800' },
                      { label: 'Baja', value: tasks.filter((t) => t.priority === 'Baja').length, color: '#4CAF50' }
                    ]}
                  />
                </div>
                <div className="dashboard-card">
                  <h3>
                    <TrendingUp size={20} /> Tareas por Etiqueta
                  </h3>
                  <BarChart
                    data={[
                      { label: 'Desarrollo', value: tasks.filter((t) => t.tags.includes('Desarrollo')).length },
                      { label: 'Seguridad', value: tasks.filter((t) => t.tags.includes('Seguridad')).length },
                      { label: 'Colaboración', value: tasks.filter((t) => t.tags.includes('Colaboración')).length }
                    ]}
                  />
                </div>
                <div className="dashboard-card">
                  <h3>
                    <Clock size={20} /> Resumen
                  </h3>
                  <div className="summary-stats">
                    <div className="stat-item">
                      <span className="stat-value">{tasks.length}</span>
                      <span className="stat-label">Total de Tareas</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{tasks.filter((t) => t.status === 'completed').length}</span>
                      <span className="stat-label">Tareas Completadas</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{tasks.filter((t) => t.status === 'pending').length}</span>
                      <span className="stat-label">Tareas Pendientes</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{tasks.reduce((sum, t) => sum + t.comments.length, 0)}</span>
                      <span className="stat-label">Total de Comentarios</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="tasks-container">
              <div className="tasks-header">
                <h2>Mis Tareas</h2>
                <div className="tasks-actions">
                  <div className="search-bar">
                    <Search size={20} />
                    <input type="text" placeholder="Buscar tareas..." />
                  </div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="task-filter"
                  >
                    <option value="all">Todas</option>
                    <option value="pending">Pendientes</option>
                    <option value="completed">Completadas</option>
                  </select>
                  <motion.button
                    className="add-task-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openAddTaskForm}
                  >
                    <Plus size={20} />
                    <span>Nueva Tarea</span>
                  </motion.button>
                </div>
              </div>

              <ul className="tasks-list">
                {currentTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    className={`task-item ${task.status}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="task-status">
                      {task.status === 'completed' ? (
                        <CheckCircle size={24} className="completed" />
                      ) : (
                        <Circle
                          size={24}
                          className="pending"
                          onClick={() => completeTask(task.id)}
                        />
                      )}
                    </div>
                    <div className="task-info" onClick={() => openTaskDetails(task)}>
                      <h3>{task.title}</h3>
                      <p>Fecha límite: {task.dueDate}</p>
                      
                      {task.link && (
                        <a href={task.link} target="_blank" rel="noopener noreferrer" className="task-link">
                          <Link size={16} />
                          Enlace
                        </a>
                      )}
{task.images && task.images.length > 0 && (
                        <div className="task-images">
                          <ImageIcon size={16} />
                          {task.images.length} {task.images.length === 1 ? 'imagen' : 'imágenes'}
                        </div>
                      )} 

                      <div className="task-comments">
                        <MessageSquare size={16} />
                        {task?.comments?.length} {task?.comments?.length === 1 ? 'comentario' : 'comentarios'}
                      </div>  
                    </div>
                    <div className="task-priority">
                      <span className={`priority-tag ${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    <button className="task-options" onClick={() => openTaskDetails(task)}>
                      <MessageSquare size={20} />
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <ChevronLeft size={20} />
                </button>
                <span>{currentPage}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={indexOfLastTask >= filteredTasks.length}
                  className="pagination-btn"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {selectedTask && (
          <motion.div
            className="task-details-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="task-details"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button className="close-btn" onClick={closeTaskDetails}>
                <X size={24} />
              </button>
              <h2>{selectedTask.ticket.title}</h2>
              <p>
                <strong>Descripción:</strong> {selectedTask.ticket.description}
              </p>
              <p>
                <strong>Estado:</strong> {selectedTask.ticket.status === 'completed' ? 'Completada' : 'Pendiente'}
              </p>
              <p>
                <strong>Fecha límite:</strong> {new Date (selectedTask.ticket.dueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Prioridad:</strong> {selectedTask.ticket.priority}
              </p>
              {selectedTask.link && (
                <p>
                  <strong>Enlace:</strong>{' '}
                  <a href={selectedTask.link} target="_blank" rel="noopener noreferrer" className="task-link">
                    {selectedTask.link}
                  </a>
                </p>
              )}
              <div className="task-tags">
                {(selectedTask?.tags || []).map((tag) => (
                  <span key={tag} className="task-tag">
                    {tag}
                  </span>
                ))}
              </div>
              {selectedTask?.images?.length > 0 && (
                <div className="task-images-preview">
                  <h3>Imágenes:</h3>
                  <div className="images-grid">
                    {selectedTask.images.map((image, index) => (
                      <img key={index} src={image} alt={`Imagen ${index + 1}`} />
                    ))}
                  </div>
                </div>
              )}
              <div className="task-comments-section">
                <h3>Comentarios:</h3>
                {selectedTask?.comments?.length > 0 ? (
                  <ul className="comments-list">
                    {selectedTask.comments.map((comment) => (
                      <li key={comment.id} className="comment">
                        <div className="comment-header">
                          <strong>{comment.author}</strong>
                          <span>{comment.date}</span>
                        </div>
                        <p>{comment.content}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay comentarios aún.</p>
                )}
                <div className="add-comment">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                  />
                  <button onClick={addComment}>Agregar Comentario</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            className="task-details-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="task-details new-task-form"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button className="close-btn" onClick={closeAddTaskForm}>
                <X size={24} />
              </button>
              <h2>Agregar Nueva Tarea</h2>
              <form onSubmit={addNewTask}>
                <div className="form-group">
                  <label htmlFor="title">Título:</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleNewTaskChange}
                    className={errors.title ? 'error' : ''}
                  />
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="description">Descripción:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleNewTaskChange}
                    className={errors.description ? 'error' : ''}
                  />
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate">Fecha límite:</label>
                  <div className="date-picker-wrapper">
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleNewTaskChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={errors.dueDate ? 'error' : ''}
                    />
                    <Calendar className="date-picker-icon" size={20} />
                  </div>
                  {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="priority">Prioridad:</label>
                  <select
                    id="priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleNewTaskChange}
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="link">Enlace (opcional):</label>
                  <input
                    type="url"
                    id="link"
                    name="link"
                    value={newTask.link}
                    onChange={handleNewTaskChange}
                    placeholder="https://ejemplo.com"
                    className={errors.link ? 'error' : ''}
                  />
                  {errors.link && <span className="error-message">{errors.link}</span>}
                </div>
                <div className="form-group">
                  <label>Etiquetas:</label>
                  <div className="tags-container">
                    {['Desarrollo', 'Seguridad', 'Colaboración'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`tag-button ${newTask.tags.includes(tag) ? 'selected' : ''}`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Imágenes (opcional):</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="image-upload-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <ImageIcon size={20} />
                      Subir imágenes
                    </button>
                  </div>
                  {newTask.images.length > 0 && (
                    <div className="uploaded-images">
                      {newTask.images.map((image, index) => (
                        <div key={index} className="uploaded-image">
                          <img src={image} alt={`Imagen subida ${index + 1}`} />
                          <button type="button" onClick={() => removeImage(index)}>
                            <XCircle size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="task-preview">
                  <h3>Vista previa de la tarea</h3>
                  <div className="preview-content">
                    <h4>{newTask.title || 'Título de la tarea'}</h4>
                    <p>{newTask.description || 'Descripción de la tarea'}</p>
                    <p>Fecha límite: {newTask.dueDate}</p>
                    <p>Prioridad: {newTask.priority}</p>
                    {newTask.link && (
                      <p>
                        Enlace:{' '}
                        <a href={newTask.link} target="_blank" rel="noopener noreferrer" className="task-link">
                          {newTask.link}
                        </a>
                      </p>
                    )}
                    <div className="preview-tags">
                      {newTask.tags.map((tag) => (
                        <span key={tag} className="task-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {newTask.images.length > 0 && (
                      <div className="preview-images">
                        <p>Imágenes: {newTask.images.length}</p>
                        <div className="images-grid">
                          {newTask.images.map((image, index) => (
                            <img key={index} src={image} alt={`Vista previa ${index + 1}`} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" className="submit-btn">
                  Agregar Tarea
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .user-dashboard {
          background-color: #0a0a0a;
          color: #e0e0e0;
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Arial', sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 300;
          background: linear-gradient(45deg, #F33F31, #E77171);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .user-name {
          font-size: 1rem;
          color: #ffffff;
        }

        .dashboard-content {
          display: flex;
          gap: 2rem;
        }

        .dashboard-sidebar {
          width: 200px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 1rem;
        }

        .dashboard-sidebar ul {
          list-style-type: none;
          padding: 0;
        }

        .dashboard-sidebar li {
          margin-bottom: 0.5rem;
        }

        .dashboard-sidebar a {
          color: #b0b0b0;
          text-decoration: none;
          display: block;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .dashboard-sidebar a:hover,
        .dashboard-sidebar a.active {
          background-color: rgba(243, 63, 49, 0.2);
          color: #F33F31;
        }

        .main-content {
          flex: 1;
        }

        .statistics-dashboard {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 2rem;
        }

        .statistics-dashboard h2 {
          font-size: 1.8rem;
          font-weight: 300;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .dashboard-card {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .dashboard-card h3 {
          font-size: 1.2rem;
          font-weight: 300;
          color: #F33F31;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .stat-item {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #F33F31;
          display: block;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #b0b0b0;
        }

        .tasks-container {
          flex: 1;
        }

        .tasks-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .tasks-header h2 {
          font-size: 1.8rem;
          font-weight: 300;
          color: #ffffff;
        }

        .tasks-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 0.5rem 1rem;
        }

        .search-bar input {
          background: none;
          border: none;
          color: #ffffff;
          margin-left: 0.5rem;
          outline: none;
        }

        .task-filter {
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          outline: none;
        }

        .add-task-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #F33F31;
          color: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-task-btn:hover {
          background-color: #E77171;
        }

        .tasks-list {
          list-style-type: none;
          padding: 0;
        }

        .task-item {
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
          transition: background-color 0.3s ease;
        }

        .task-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .task-item.completed {
          opacity: 0.6;
        }

        .task-status {
          margin-right: 1rem;
        }

        .task-status .completed {
          color: #4CAF50;
        }

        .task-status .pending {
          color: #FFC107;
          cursor: pointer;
        }

        .task-info {
          flex: 1;
          cursor: pointer;
        }

        .task-info h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #ffffff;
        }

        .task-info p {
          margin: 0.5rem 0 0;
          font-size: 0.9rem;
          color: #b0b0b0;
        }

        .task-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .task-tag {
          font-size: 0.8rem;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .task-link, .task-images, .task-comments {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #b0b0b0;
          margin-top: 0.5rem;
        }

        .task-link:hover {
          color: #F33F31;
        }

        .task-priority {
          margin-right: 1rem;
        }

        .priority-tag {
          font-size: 0.8rem;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
        }

        .priority-tag.alta {
          background-color: rgba(244, 67, 54, 0.2);
          color: #F44336;
        }

        .priority-tag.media {
          background-color: rgba(255, 152, 0, 0.2);
          color: #FF9800;
        }

        .priority-tag.baja {
          background-color: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
        }

        .task-options {
          background: none;
          border: none;
          color: #b0b0b0;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .task-options:hover {
          color: #ffffff;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2rem;
        }

        .pagination-btn {
          background: none;
          border: none;
          color: #F33F31;
          cursor: pointer;
          padding: 0.5rem;
          transition: color 0.3s ease;
        }

        .pagination-btn:disabled {
          color: #b0b0b0;
          cursor: not-allowed;
        }

        .pagination span {
          margin: 0 1rem;
          color: #ffffff;
        }

        .task-details-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .task-details {
          background-color: #1a1a1a;
          border-radius: 10px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
        }

        .task-details h2 {
          margin-top: 0;
          color: #F33F31;
        }

        .task-details p {
          margin-bottom: 1rem;
        }

        .new-task-form {
          max-width: 600px;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #b0b0b0;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.5rem;
          border-radius: 5px;
          border: 1px solid #333;
          background-color: #2a2a2a;
          color: #ffffff;
          font-size: 1rem;
        }

        .form-group input[type="date"] {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #F44336;
        }

        .error-message {
          color: #F44336;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .date-picker-wrapper {
          position: relative;
        }

        .date-picker-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #b0b0b0;
          pointer-events: none;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag-button {
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          padding: 0.3rem 0.6rem;
          border-radius: 15px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .tag-button.selected {
          background-color: #F33F31;
        }

        .image-upload-container {
          margin-top: 0.5rem;
        }

        .image-upload-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .image-upload-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .uploaded-images {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1rem;
        }

        .uploaded-image {
          position: relative;
          width: 100px;
          height: 100px;
        }

        .uploaded-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 5px;
        }

        .uploaded-image button {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          background: #F33F31;
          border: none;
          border-radius: 50%;
          color: #ffffff;
          cursor: pointer;
          padding: 0.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .task-preview {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 1rem;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .task-preview h3 {
          margin-top: 0;
          color: #F33F31;
          font-size: 1.2rem;
        }

        .preview-content {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          padding: 1rem;
        }

        .preview-content h4 {
          margin-top: 0;
          color: #ffffff;
        }

        .preview-content p {
          margin-bottom: 0.5rem;
          color: #b0b0b0;
        }

        .preview-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .preview-images {
          margin-top: 1rem;
        }

        .preview-images .images-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .preview-images .images-grid img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 5px;
        }

        .submit-btn {
          background-color: #F33F31;
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #E77171;
        }

        .task-comments-section {
          margin-top: 2rem;
        }

        .task-comments-section h3 {
          color: #F33F31;
          margin-bottom: 1rem;
        }

        .comments-list {
          list-style-type: none;
          padding: 0;
        }

        .comment {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .comment-header strong {
          color: #F33F31;
        }

        .comment-header span {
          color: #b0b0b0;
        }

        .comment p {
          margin: 0;
          color: #e0e0e0;
        }

        .add-comment {
          margin-top: 1rem;
        }

        .add-comment textarea {
          width: 100%;
          padding: 0.5rem;
          border-radius: 5px;
          border: 1px solid #333;
          background-color: #2a2a2a;
          color: #ffffff;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          resize: vertical;
        }

        .add-comment button {
          background-color: #F33F31;
          color: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .add-comment button:hover {
          background-color: #E77171;
        }

        @media (max-width: 768px) {
          .user-dashboard {
            padding: 1rem;
          }

          .dashboard-content {
            flex-direction: column;
          }

          .dashboard-sidebar {
            width: 100%;
            margin-bottom: 1rem;
          }

          .dashboard-sidebar ul {
            display: flex;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .dashboard-sidebar li {
            margin-right: 1rem;
            margin-bottom: 0;
          }

          .tasks-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .tasks-actions {
            width: 100%;
            margin-top: 1rem;
          }

          .search-bar {
            width: 100%;
          }

          .task-filter {
            width: 100%;
          }

          .add-task-btn {
            width: 100%;
            justify-content: center;
          }

          .task-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .task-status {
            margin-bottom: 0.5rem;
          }

          .task-priority {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }

          .task-options {
            align-self: flex-end;
          }

          .task-details {
            width: 95%;
            padding: 1.5rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}