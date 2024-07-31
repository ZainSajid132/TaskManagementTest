using Microsoft.EntityFrameworkCore;
using Task.Service.Interface;
using TaskRepositry;
using TaskRepositry.Entity;

namespace Task.Service.Service
{
    public class TaskManagementService : ITaskManagement
    {
        private IAuthrization _authrization;
        private readonly TaskContext _taskContext;

        public TaskManagementService(TaskContext taskContext, IAuthrization authrization)
        {
                this._taskContext = taskContext;
                this._authrization = authrization;

        }
        public async Task<Tasks> CreateTask(TaskRepositry.Entity.Tasks task)
        {
             task.CreatedBy = _authrization.GetCurrentUser();
             await this._taskContext.Tasks.AddAsync(task);
             await this._taskContext.SaveChangesAsync();
            return task;
        }

        public async Task<int> DeleteTask(int id)
        {
            var task = await _taskContext.Tasks.FindAsync(id);
            if (task != null)
            {
                var data = _taskContext.Tasks.Remove(task);
                 await _taskContext.SaveChangesAsync();
                return id;
            }
            else
            {
                return 0;
            }

           
        }

        public async Task<List<Tasks>> GetAllTasks()
        {
            string username = _authrization.GetRegularUser();
            if(!string.IsNullOrEmpty(username))
            {
                return await _taskContext.Tasks.Where(e => e.CreatedBy.ToLower() == username.ToLower()).ToListAsync();

            }
            else
            {
                return  await _taskContext.Tasks.ToListAsync();
            }
        }

        public async Task<Tasks> GetTask(int id)
        {
            return await _taskContext.Tasks.FirstOrDefaultAsync(c => c.TaskId == id);
        }

        public  async Task<Tasks> UpdateTask(Tasks task)
        {
            _taskContext.Entry(task).State = EntityState.Modified;
            await _taskContext.SaveChangesAsync();
            return task;
        }
    }
}
