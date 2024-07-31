using Task.Model.EntityValidation;

namespace Task.Model
{
    public class TaskModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [FutureDateAttribute]
        public DateTime DueDate { get; set; }
        public string Priority { get; set; }
        public string CreatedBy { get; set; }
    }
}
