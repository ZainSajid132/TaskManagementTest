using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task.Model;
using TaskRepositry.Entity;

namespace Task.Service.Interface
{
    public interface IAuthrization
    {
        Task<AuthUser> Get(AuthrizationModel userAuth);
        UserClaims GetCurrentUserClaim();
        string GetRegularUser();
        string GetCurrentUser();
    }
}
