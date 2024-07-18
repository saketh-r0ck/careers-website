const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer')
const fs = require('fs')
const path = require('path')

/*   Restapi   */
const jobsApi = require('./routes/jobsRoute');
const { log } = require('console');

const app = express();
const port = 4000;

app.use('/jobs',jobsApi)

mongoose.connect('mongodb://localhost:27017/testdb',{useNewUrlParser: true})
    .then(() => {
        console.log("MongoDb connection open !!");
    })
    .catch((err) =>{
        console.log("Oh no Mongo Connection Error!!!!");
        console.log(err);
    });
    
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

app.set('view engine','ejs');

app.listen(port,function(){
    console.log('Listening on port ' + port);
});


/*  gets */
app.get('/',function(req,res){
    loggedUser = "Login"
    Job.find().then((foundJobslist)=>{
    
        res.render('index',{userslist:foundJobslist,searchMessage :"" })
    
    })
});

let descMessage =""
app.post('/',async(req,res)=>{
    await Job.findOne({Job_id : req.body.job}).then((foundJob)=>{   
        apply_job=foundJob    
        desc = apply_job.Job_Description.split('\r\n')
        res.render('description',{user:loggedUser,jobdetails:apply_job,description: desc,dMessage:descMessage});
    })
})

let signupMessage = "";
app.get('/signup',function(req,res){  
    console.log("signupMessage :", signupMessage)
    res.render("signup",{message : signupMessage});
});

app.get('/about_us',(req,res)=>{
    console.log("about us: "+ loggedUser)

    res.render("about_us",{user:loggedUser})
})

app.get('/contact_us',(req,res)=>{
    console.log("conatact us: "+ loggedUser)

    res.render('contact_us',{user:loggedUser})
})
/*  search */

app.post("/search",async function(req,res){
    let searchkey =req.body.key;
    let data=await Job.find({$or : [{Title:{$regex: searchkey,$options:'i'}},{Company : {$regex : searchkey,$options : 'i'}}]})
    if (data.length == 0){
        res.render('userpage',{user: loggedUser,userslist:data, searchMessage : "No Jobs Found!"})
    }else{
        res.render('userpage',{user : loggedUser,userslist:data, searchMessage : ""})
    }
 });

app.post("/jobslistsearch",async function(req,res){
    let searchkey = req.body.jkey;
    let data = await Job.find({$or :[{Job_Title:{$regex: searchkey,$options:'i'}},{Company : {$regex: searchkey,$options:'i'}}]})
    res.render('adminindex',{jlist: data,admtype : admintype  ,admuname :adminuname})
})

app.post("/appslistsearch", async function(req, res){
    let searchkey = req.body.akey;
    let data = await Application.find({$or:[{Name:{$regex: searchkey,$options:'i'}},{Phone:{$regex: searchkey,$options:'i'}},{Company:{$regex: searchkey,$options:'i'}},{Job_Title:{$regex:searchkey,$options:'i'}}]})
    res.render('applications',{applist : data,admtype:admintype  ,admuname :adminuname})
})

app.post('/userlistsearch',async function(req,res){
    let searchkey = req.body.ukey;
    let data = await User.find({$or : [{email :{$regex : searchkey,$options:'i'}},{phoneno : {$regex:searchkey,$options:'i'}}]})
    res.render('usersList',{ulists: data,admtype:admintype  ,admuname :adminuname});
})

 app.get('/userpage',(req,res)=>{
    if(loggedUser == "Login"){
        res.redirect('/')
    }else{
        Job.find().then((foundJobslist)=>{
            res.render('userpage',{user : loggedUser,userslist:foundJobslist,searchMessage : " "})
        })
    }
 })



/*  users page  */ 

/*   login  */

let loginMessage = "";
app.get('/login.html',(req,res)=>{
    res.render('login',{message: loginMessage});
});

let loggedUser = "Login";
let loggedUserEmail = "";
app.post("/login",async function(req,res){
    await User.findOne({email : req.body.email}).then((user_found)=>{    
        if (user_found){   
            loggedUser = user_found.firstName
            loggedUserEmail = user_found.email
            try{        
                bcrypt.compare(req.body.password, user_found.password,function (err,result){   
                    if(result == true){
                        Job.find().then((foundJobslist)=>{
                            res.render('userpage',{user : loggedUser,userslist:foundJobslist,searchMessage : ""})
                        })
                    }else{
                        loginMessage = "Password doesn't match"
                        res.redirect('/login.html')
                    }
                })
            }catch(error){
                return res.status(500).send()
            } 
        }else{
            loginMessage = "User doesn't exist. Register a new account"
            res.redirect("/login.html")
        }    
    })
});

/*  Signup and users list  */

    /* New User - Signup */
    const usersSchema = new mongoose.Schema({
        
        firstName : String,
        lastName : String,
        skills : String,
        qualification : String,
        gender : String,
        experience : String,
        phoneno : String,
        location : String,
        email : String,
        password : String,
        Resume : String,
        Resume_Path : String,
        Resume_Mimetype : String
    });
    
    const User = mongoose.model('User',usersSchema);

    const resumeStorage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './public/resumes')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname+"-"+Date.now()+"-"+file.originalname)
        }
    })
    
      
    const upload = multer({ storage: resumeStorage})

    app.post("/signup",upload.single('resume'),async function(req,res){      
        
        /* encrypting password  */ 
        const admin_password = req.body.password
        const hashed_password = await bcrypt.hash(admin_password,10)
        
        const newuser = new User({
           
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            experience : req.body.experience,
            qualification : req.body.qualification,
            gender : req.body.gender,
            skills : req.body.skills,
            phoneno : req.body.phoneno,
            location : req.body.location,
            email: req.body.email,
            password : hashed_password,
            Resume : req.file.filename,
            Resume_Path : req.file.path,
            Resume_Mimetype : req.file.mimetype
        });         
        
        
        await User.find({email : req.body.email }).then(function(foundUsersList){
            if(foundUsersList.length === 0){
                      
                
                
                    loginMessage = 'User Added Successfully';
                    newuser.save();
                    res.redirect("/login.html");
               
               
            }else{
                signupMessage = "User Existed try login with existing email ";
                res.redirect('/signup');
            }
        });
        
    });



/*      admin     */
    /*   admin users list  */ 

    app.get("/usersList.html",(req,res)=>{
        User.find().then(function(foundUsersList){
            
            res.render('usersList',{ulists : foundUsersList,admtype: admintype  ,admuname :adminuname});
        });
    });



/*  Admin Login  */   
let adminMessage = ""

app.get("/admin",function(req,res){
    res.render('adminLogin',{message: adminMessage});
});

const adminSchema = new mongoose.Schema({
    adminUserName : String,
    adminPassword : String,
    adminType : String
});

const Admin = mongoose.model('Admin',adminSchema);
const admin_password = "superadmin"

bcrypt.hash(admin_password,10,(err,hash)=>{
    if (err) return err;
    const webAdmin = new Admin({adminUserName:"superadmin",adminPassword: hash,adminType : "superadmin"});
    //webAdmin.save();
})

let admintype = '';
let adminuname = '';
app.post("/admin", async function(req,res){

    const user = await Admin.findOne({adminUserName: req.body.adminusername});
    if (user){
        try{
            bcrypt.compare(req.body.adminpassword, user.adminPassword,async function (err,result){
                if(result == true){
                    if(req.body.admintype == user.adminType && user.adminType == "superadmin"){
                        admintype = 'superadmin';
                    }else if(req.body.admintype == user.adminType && user.adminType == "admin") {
                        admintype = 'admin';
                    }else if(req.body.admintype != user.adminType){
                        adminMessage = "You are not " + req.body.admintype  
                        res.redirect('/admin')
                    }
                    adminuname = req.body.adminusername
                    const foundjobslist = await Job.find()
                    res.render('adminIndex',{jlist:foundjobslist,admtype: admintype  ,admuname :adminuname})
                }else{
                    adminMessage = "Password is wrong!!"
                    res.redirect('/admin')
                }
            })
        }catch(error){
            res.status(500).send()
        }
    }else{
        adminMessage = "Username is wrong!!";
        res.redirect('/admin');
    }
});
/*    Admin Jobs list  */ 
app.get("/adminIndex.html",async (req,res)=>{
    await Job.find().then((foundJobslist)=>{
        console.log(adminuname)
        res.render('adminIndex',{jlist:foundJobslist,admtype: admintype  ,admuname :adminuname});
    })
    
});

/*      admin Job delete options   */ 
app.post("/deletejob",async function(req,res){
    let job_id=req.body.job_deleteid;
    
    await Job.deleteOne({"Job_id":job_id})
    res.redirect("/adminIndex.html")
    
});
app.post("/editjob1",async function(req,res){
    let job_id=req.body.job_editid;
    let jobdetails=await Job.findOne({"Job_id":job_id})
    res.render('editJob',{jlist:jobdetails,admtype: admintype  ,admuname :adminuname})
    
});
app.post("/editjob2",async function(req,res){
    
    let updatedjob = await Job.findOneAndUpdate(
        { Job_id:req.body.job_id},
        { $set:  {  Job_id : req.body.job_id,
        Posted_Date :  getDate(),
        Title : req.body.job_title,
        Category : req.body.job_category,
        Company : req.body.company,
        Employment_Type : req.body.employment_type,
        Location : req.body.location,
        Hremail : req.body.hr_email,
        Hrphoneno : req.body.hr_phoneno,
        Job_Description : req.body.job_description
           
        }},
      )
      
      res.redirect('adminIndex.html')
});


/*  getting description page jobtitle  */
let apply_job;

const applicationSchema = new mongoose.Schema({
    Job_id :Number,
    Job_Title : String,
    Company : String,
    Name: String,
    Email: String,
    Phone: String,
    skills : String,
    Qualification : String,
    Gender : String,
    Experience : String,
        
    Location : String,
    Applied_date:String,
    Resume : String,
    Resume_Path : String,
    Resume_Mimetype : String,   
    
});

const Application = mongoose.model('Application',applicationSchema);

app.post("/userpage",async function(req,res){
    await Job.findOne({Job_id : req.body.job}).then((foundJob)=>{   
        apply_job=foundJob    
        descMessage = ""
        desc = apply_job.Job_Description.split('\r\n')
        res.render('description',{user:loggedUser,jobdetails:foundJob,description: desc,dMessage:descMessage});
    })

});
/*  getting description page jobtitle  */
let formMessage;
app.post("/description",async function(req,res){
    
    //res.render('form',{job_tittle : apply_job.Title,user : loggedUser,message:formMessage})
    //res.redirect("/userpage")
   
    const app_foundUser = await User.findOne({email:loggedUserEmail})
        let app_name = app_foundUser.firstName + " " + app_foundUser.lastName
        let app_location   = app_foundUser.location
        let app_email = app_foundUser.email
        let app_phoneno = app_foundUser.phoneno
        let app_skills = app_foundUser.skills
        let app_gender   = app_foundUser.gender
        let app_qualification   = app_foundUser.qualification
        let app_resumepath   = app_foundUser.Resume_Path
        

        const newappjob = new Application({
            Job_id : apply_job.Job_id,
            Job_Title : apply_job.Title,
            Company : apply_job.Company,
            Name : app_name,
            Email : app_email,
            Phone: app_phoneno,
            Skills : app_skills,
            Qualification : app_qualification,
            Location :app_location,
            Gender : app_gender,
            Applied_date:getDate(),
            Resume_Path : app_resumepath
            
        });
        await Application.find({Job_id:apply_job.Job_id,Email:loggedUserEmail}).then(async (foundApplication)=>{
            if(foundApplication.length == 0){
                newappjob.save();
                res.render('formsubmission')
            }else{
                descMessage = "You have applied for this job already."
                res.render('description',{user:loggedUser,jobdetails:apply_job,description: desc,dMessage:descMessage});
            }
        });
                
});
 
/*  form  */ 
// app.get('/form1',async function(req,res){
//     console.log("form: "+ loggedUser)

//     console.log(formMessage)
//     res.render('form',{job_tittle: apply_job.Title,user : loggedUser,message:formMessage})
// })



//     const resumeStorage = multer.diskStorage({
//         destination: function (req, file, cb) {
//         cb(null, 'public/resumes')
//         },
//         filename: function (req, file, cb) {
//             cb(null, file.fieldname+"-"+Date.now()+"-"+file.originalname)
//         }
//     })

    
//     const upload = multer({ storage: resumeStorage})

// app.post("/form",upload.single('resume'),async function(req,res){
    // const newappjob = new Application({
    //     Job_id : apply_job.Job_id,
    //     Job_Title : apply_job.Title,
    //     Username : loggedUser,
    //     Name : req.body.name,
    //     Email : req.body.email,
    //     Phone:req.body.Phonenumber,
    //     Applied_date:getDate(),
    //     Resume :req.file.filename,
    //     Resume_Path : req.file.path,
    //     Resume_Mimetype : req.file.mimetype
        
    // });
//     await Application.find({Job_id:apply_job.Job_id,Username:loggedUser}).then((foundApplication)=>{
//         if(foundApplication.length == 0){
//             const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//             if (!allowedMimeTypes.includes(req.file.mimetype)) {
//                 formMessage = "Resume should be PDF ,Doc or Docx format"
//                 res.redirect('/form1')

//             }else{ 
//                 newappjob.save();
//                 res.render('formsubmission')
//             }
//         }else{
//             formMessage = "*You have already applied for this job , Please check your aplication status."
//             res.redirect('/form1')
//         }
//     })
// });

app.post("/formSubmission",(req,res)=>{
    res.redirect("/userpage")
})

/*    Manage JObs   */
let randomNum;
app.get("/manageJobs",async(req,res)=>{
    const min = 10000;
    const max = 99999;
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    await Job.find({Job_id : randomNum}).then((foundJob)=>{
        if (foundJob.length == 0){
            res.render('manageJobs',{random:randomNum,admtype:admintype  ,admuname :adminuname});
        }else{
            res.redirect('/manageJobs')
        }
    })
    
});

const jobsSchema = new mongoose.Schema({
    Job_id : Number,
    Posted_Date : String,
    Title : String,
    Company : String,
    Category : String,
    Hremail : String,
    Hrphoneno : String,
    Employment_Type : String,
    Location : String,
    Job_Description : String
});

const Job = mongoose.model('Job',jobsSchema)

function getDate(){

    const date_ob = new Date();  
    let date = ("0" + date_ob.getDate()).slice(-2); // current date
    let month = date_ob.toLocaleString('default', { month: 'short' });    // current month
    let year = date_ob.getFullYear();   // current year
    let hours = date_ob.getHours();     // current hours
    let minutes = date_ob.getMinutes(); // current minutes
    let seconds = date_ob.getSeconds(); // current seconds
    let date_time =  (date + " " + month + " " + year + " " + hours + ":" + minutes);    
    return date_time
}


app.post("/manageJobs",(req,res)=>{
    console.log(req.body)
    const newJob = new Job({
        Job_id : randomNum,
        Posted_Date :  getDate(),
        Title : req.body.job_title,
        Company : req.body.company,
        Category : req.body.job_category,        
        Employment_Type : req.body.employment_type,
        Location : req.body.location,
        Job_Description : req.body.job_description,
        Hremail : req.body.hr_email,
        Hrphoneno : req.body.hr_phoneno
    })
    newJob.save()
    res.redirect('/manageJobs')
})


/*   user profile    */ 

app.get('/userProfile',async(req,res)=>{
    if (loggedUser == "Login"){
        res.render('login',{message: loginMessage})
    }else{
        await User.findOne({email : loggedUserEmail}).then(function(foundUser){

        Application.find({Email : loggedUserEmail}).then((foundApplications)=>{
            
            let fullName = foundUser.firstName + " " + foundUser.lastName
            res.render('userProfile',{user:loggedUser,
                                    name : fullName,
                                    gender : foundUser.gender,
                                    email : foundUser.email,
                                    phone : foundUser.phoneno,
                                    resume : foundUser.Resume_Path,
                                    userapplist: foundApplications
                                    })
        })
    })
    }
    
})

// app.get('/DeleteAccount/:username',async(req,res)=>{
//     deleteUser = req.params.username
//     await Application.deleteMany({Username:deleteUser}).then(async(err)=>{
//         await User.deleteOne({userName:deleteUser})

//     })
//     loggedUser = "Login"
//     res.redirect('/')
// })


/*      admin applications   */ 

app.get("/applications.html",async (req,res)=>{
    await Application.find().then((foundApplications)=>{
        res.render('applications',{applist : foundApplications,admtype : admintype  ,admuname :adminuname})
    })
    
});

app.get("/public/resumes/:resume",async(req,res)=>{
    const resume = req.params.resume
    const filepath = path.join(__dirname ,"/public/resumes/",resume)
    await Application.findOne({Resume : resume}).then((foundApplication)=>{
        if (foundApplication) {
            res.setHeader('Content-Type', foundApplication.Resume_Mimetype);
            // for display in browser and for download
            res.setHeader('Content-Disposition', 'inline; filename="' + resume + '"');
    
            const readStream = fs.createReadStream(filepath);
            readStream.pipe(res);
        } else {
            res.status(404).send('File not found');
        }
    })
})

app.post('/applications',async(req,res)=>{
    let del = await Application.findOneAndUpdate(
        { Job_id: req.body.job_id, Username : req.body.user_name },
        { $set: { Status: req.body.status_btn } },
        { new: true });
    res.redirect('/applications.html')
})
