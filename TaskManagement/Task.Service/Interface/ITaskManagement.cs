using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskRepositry.Entity;

namespace Task.Service.Interface
{
    public interface ITaskManagement
    {
        Task<Tasks> GetTask(int id);
        Task<List<Tasks>> GetAllTasks();
        Task<Tasks> CreateTask(Tasks task);
        Task<Tasks> UpdateTask(Tasks task);
        Task<int> DeleteTask(int id);
    }
}
