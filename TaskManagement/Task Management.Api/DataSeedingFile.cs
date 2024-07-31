using Task.Common;
using Task.Model;
using Task.Model.Constants;
using TaskRepositry;
using TaskRepositry.Entity;

namespace Task_Management.Api
{
    public static class DataSeedingFile
    {
        public static void InitializeDatabaseData(this TaskContext _taskContext)
        {
            InsertDefaultUsers(_taskContext);
            InsertDefaultTasks(_taskContext);
        }

        private static void InsertDefaultUsers(TaskContext _context)
        {
            // List of users to seed
            var usersToSeed = new List<AuthUser>
            {
                new AuthUser
                {
                    Email = "zain@gmail.com",
                    Password = "12345",
                    RoleName = UserRolesConstant.Admin.ToString(),
                },
                new AuthUser
                {
                    Email = "wasif@gmail.com",
                    Password = "56789",
                    RoleName = UserRolesConstant.RegularUser.ToString(),
                }
            };

            // Check if there are users in the database
            var existingUserEmails = _context.AuthUsers
                                              .Select(u => u.Email)
                                              .ToHashSet(); // Using HashSet for O(1) lookups

            // Find users to add (those that do not already exist in the database)
            var usersToAdd = usersToSeed
                             .Where(u => !existingUserEmails.Contains(u.Email))
                             .ToList();

            // Add new users if any
            if (usersToAdd.Any())
            {
                _context.AuthUsers.AddRange(usersToAdd);
                _context.SaveChanges();
            }
        }

        private static void InsertDefaultTasks(TaskContext _context)
        {
            // List of tasks to seed
            var tasksToSeed = new List<Tasks>
            {
                new Tasks
                {
                    Title = "Task 1",
                    Description = "Assigned Task",
                    DueDate = DateTime.Now.AddDays(50),
                    priority = Priority.Low.ToString(),
                    CreatedBy = "Zain"
                },
                new Tasks
                {
                    Title = "Task 2",
                    Description = "Check Updated Task",
                    DueDate = DateTime.Now.AddDays(50),
                    priority = Priority.Low.ToString(),
                    CreatedBy = "Touqeer"
                }
            };

            // Fetch existing tasks from the database
            var existingTaskTitles = _context.Tasks
                                            .Select(t => t.Title)
                                            .ToHashSet(); // Using HashSet for O(1) lookups

            // Find tasks to add (those that do not already exist in the database)
            var tasksToAdd = tasksToSeed
                             .Where(t => !existingTaskTitles.Contains(t.Title))
                             .ToList();

            // Add new tasks if any
            if (tasksToAdd.Any())
            {
                _context.Tasks.AddRange(tasksToAdd);
                _context.SaveChanges();
            }
        }
    }
}
