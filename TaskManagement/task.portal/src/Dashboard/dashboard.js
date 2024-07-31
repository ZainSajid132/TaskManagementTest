import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom/dist";
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from './Datatable'
import AddTask from './AddTask';
import { Row } from 'antd';
import AddTaskModal from './AddTask';
import { CONSTANT_VARIABLES } from '../common/constants'

const Dashboard = () => {
  
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const token = localStorage.getItem('auth_token');
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [currentModalData, setCurrentModalData] = useState({});


  useEffect(() => {
    if (!token) {
      setRedirect(true);
      return;
    }

    axios.get('https://localhost:44394/api/Task', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load tasks');
        setLoading(false);
      });
  }, [token]);

  if (redirect) {
    return <navigate to="/sign-in" />;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleButtonClick = () => {
    alert('Button clicked!');
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.length - b.title.length,
    },

    {
      title: "Description",
      dataIndex: "description",
    },

    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a, b) => a.dueDate.length - b.dueDate.length,
    },

    {
      title: "Priority",
      dataIndex: "priority",
      sorter: (a, b) => a.priority.length - b.priority.length,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      sorter: (a, b) => a.createdBy.length - b.createdBy.length,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, row) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2 btn btn-primary"
              onClick={() => handleModal(row, CONSTANT_VARIABLES.UPDATE)}
            >
              Edit
            </Link>
            <Link className="confirm-text p-2 btn btn-danger"
              onClick={() => handleDelete(row)}
            >
              Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const handleModal = (taskData, actionName) => {
    debugger
    const taskModalObj = {
      formData: actionName === CONSTANT_VARIABLES.UPDATE ? taskData : {},
    };
    setCurrentModalData(taskModalObj);
    setTaskModalOpen(true);
  };

  const handleDelete = (row) => {
    debugger
    if (!token) {
      setRedirect(true);
      return;
    }

    axios.delete(`https://localhost:44394/api/Task/${row.taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        debugger
        navigate('/dashboard');
        setTasks(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load tasks');
        setLoading(false);
      });
  }

  const toggleTaskModal = (value) => {
    setTaskModalOpen(false);
  }

  const handleRefreshDashboard = () => {
    if (!token) {
      setRedirect(true);
      return;
    }

    axios.get('https://localhost:44394/api/Task', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load tasks');
        setLoading(false);
      });
  }
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>TASK</h4>
                <h6>Manage your Tasks</h6>
              </div>
            </div>
            <AddTask />
            <div className="page-btn m-3">
              <Link
                onClick={() => handleModal({}, CONSTANT_VARIABLES.ADD)}
                className="btn btn-primary"
              >
                Add New Task
              </Link>
              <Link
                onClick={() => handleRefreshDashboard()}
                className="btn btn-primary"
              >
                Refresh
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              {isTaskModalOpen ? (
                <AddTaskModal
                  currentModalData={currentModalData}
                  isModalOpen={isTaskModalOpen}
                  isUpdate={currentModalData.formData?.taskId ? true : false}
                  toggleModal={toggleTaskModal}
                />
              ) : null}
              <div className="table-responsive">
                <Table columns={columns} dataSource={tasks} />
              </div>
            </div>
            {/* /product list */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
