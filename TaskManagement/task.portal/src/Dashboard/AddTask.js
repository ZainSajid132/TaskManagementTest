import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select } from 'antd';
import { Modal } from 'antd';
import { CONSTANT_VARIABLES } from '../common/constants';
import CustomFormLabel from "../common/CustomFormLabel";
import IntlMessages from "../common/intlMessages";
import getEnvDetail from '../Configurations/env.Config.json';
import TextArea from 'antd/es/input/TextArea';

const AddTaskModal = (props) => {
  const { currentModalData, isModalOpen, isUpdate, toggleModal } = props;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const BaseUrl = getEnvDetail['Default'].apiUrl;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('auth_token');
  const [redirect, setRedirect] = useState(false);

  const PriorityList = [
    { value: "Low", id: 1 },
    { value: "Medium", id: 2 },
    { value: "High", id: 3 },
  ];

  const handleRecord = async (actionName, taskData) => {
    if (!token) {
      setRedirect(true);
      return;
    }
    if (actionName === CONSTANT_VARIABLES.UPDATE) {
      taskData.taskId = currentModalData.formData.taskId;
      taskData.createdBy = currentModalData.formData.createdBy;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    };
    try {
      if (actionName === CONSTANT_VARIABLES.ADD) {
        const response = await axios.post('https://localhost:44394/api/Task', taskData, config);
      } else {
        const response = await axios.put(`https://localhost:44394/api/Task/${taskData.taskId}`, taskData, config);
      }
      toggleModal(true);
      // Store token in local storage or use context
      navigate('/dashboard'); // Redirect to task list page
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
    if (redirect) {
      navigate('/sign-in');
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={() => toggleModal(true)}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            values.priority = PriorityList.filter(c => c.id == values.priority)[0].value;
            if (!isUpdate) {
              values.taskId = 0
              values.createdBy = "zain"
            }
            handleRecord(isUpdate ? CONSTANT_VARIABLES.UPDATE : CONSTANT_VARIABLES.ADD, values);
          })
          .catch(info => {
            console.log(CONSTANT_VARIABLES.VALIDATION_FAILED, info);
          });
      }}
      onCancel={() => toggleModal(true)}
      title={
        isUpdate ? (
          <IntlMessages id="task.management.form.modal.title.update" />
        ) : (
          <IntlMessages id="task.management.form.modal.title.add" />
        )
      }
      okText={
        isUpdate ? (
          <IntlMessages id="task.management.form.modal.update" />
        ) : (
          <IntlMessages id="task.management.form.modal.add" />
        )
      }
      cancelText={<IntlMessages id="task.management.form.modal.cancelText" />}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        name="TaskForm"
        className='taskManagement_addModalWrapper'
        initialValues={{
          title: currentModalData?.formData.title,
          description: currentModalData?.formData.description,
          dueDate: currentModalData?.formData.dueDate,
          priority: currentModalData?.formData.priority,
        }}
      >
        <Form.Item
          name="title"
          className='userManagement_addModalFormItem'
          label={
            <CustomFormLabel
              labelkey="task.management.form.label.title"
              popoverkey="task.management.form.label.popover.title"
            />
          }
          rules={[
            {
              required: true,
              message: <IntlMessages id="task.management.modal.validation.title" />,
            },
          ]}
        >
          <Input placeholder={CONSTANT_VARIABLES.TASK_NAME} />
        </Form.Item>

        <Form.Item
          name="description"
          className='taskManagement_addModalFormItem'
          label={
            <CustomFormLabel
              labelkey="task.management.form.label.description"
              popoverkey="task.management.form.label.popover.description"
            />
          }
        >
          <TextArea placeholder={CONSTANT_VARIABLES.Task_DESCRIPTION} />
        </Form.Item>

        <Form.Item
          name="dueDate"
          className='taskManagement_addModalFormItem'
          label={
            <CustomFormLabel
              labelkey="task.management.form.label.due.date"
              popoverkey="task.management.form.label.popover.due.date"
            />
          }
          rules={[
            {
              required: true,
              message: <IntlMessages id="task.management.modal.validation.due.date" />,
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value) {
                  return Promise.reject('DueDate is required');
                }

                const currentDate = new Date();
                const dueDate = new Date(value);

                if (dueDate <= currentDate) {
                  return Promise.reject('DueDate must be in the future');
                }

                return Promise.resolve();
              }
            })
          ]}
        >
          <Input type="datetime-local" />
        </Form.Item>
        <Form.Item
          name="priority"
          className='taskManagement_addModalFormItem'
          label={
            <CustomFormLabel
              labelkey="task.management.form.modal.priority"
              popoverkey="task.management.form.label.popover.priority"
            />
          }
          rules={[
            {
              required: true,
              message: <IntlMessages id="task.management.modal.validation.priority" />,
            },
          ]}
        >
          <Select
            getPopupContainer={triggerNode => triggerNode.parentElement}
            classNamePrefix="react-select"
            options={PriorityList?.map(f => ({ label: f.value, value: f.id }))}
            placeholder={CONSTANT_VARIABLES.TASK_PRIORITY_NAME}
          />
        </Form.Item>
        {console.log(PriorityList)}
      </Form>
    </Modal>
    //   <>
    //   <div className="modal fade" id="add-task">
    //   <div class="container mt-5 ">
    //   <h2 class="mb-4">Task Form</h2>
    //   <form>
    //     <div class="mb-3">
    //       <label for="title" class="form-label">Title</label>
    //       <input type="text" class="form-control" id="title" placeholder="Enter task title" required/>
    //     </div>
    //     <div class="mb-3">
    //       <label for="description" class="form-label">Description</label>
    //       <textarea class="form-control" id="description" rows="3" placeholder="Enter task description" required></textarea>
    //     </div>
    //     <div class="mb-3">
    //       <label for="dueDate" class="form-label">Due Date</label>
    //       <input type="datetime-local" class="form-control" id="dueDate" required/>
    //     </div>
    //     <div class="mb-3">
    //       <label for="priority" class="form-label">Priority</label>
    //       <select class="form-select" id="priority" required>
    //         <option value="" disabled selected>Select priority</option>
    //         <option value="Low">Low</option>
    //         <option value="Medium">Medium</option>
    //         <option value="High">High</option>
    //       </select>
    //     </div>
    //     <div class="mb-3">
    //       <label for="createdBy" class="form-label">Created By</label>
    //       <input type="text" class="form-control" id="createdBy" placeholder="Enter your name" required/>
    //     </div>
    //     <button type="submit" class="btn btn-primary">Submit</button>
    //   </form>
    // </div>
    // </div>
    // </>
  )
}
export default AddTaskModal;