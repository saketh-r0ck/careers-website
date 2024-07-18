const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:true}));

router.get('/',async(req,res)=>{
    let data = await JobDetail.find()
    res.json(data)
})

const jobDetailSchema = new mongoose.Schema({
    jobtitle:{
        type:String
        
    },
    jobdescription:{
        type:String
    },
    salary:{
        type:Number
    },
    experience:{
        type:Number
        
    },
    location:{
        type:String
    }
})
const JobDetail = mongoose.model('JobDetail',jobDetailSchema)
router.post('/',async (req,res)=>{
    
    let jobdata = {
        jobtitle: req.body.jobtitle,
        jobdescription : req.body.jobdescription,
        salary: req.body.salary,
        experience : req.body.experience,
        location: req.body.location
    }
    const newjob = new JobDetail(jobdata)
    newjob.save().then(response=>{
        res.json(response)
    }).catch(err=>{
        if(err){
            console.log("erorr")
        }
    })
})

router.get('/:id',async(req,res)=>{
    let id = req.params.id
    let data = await JobDetail.findById(id)
    res.json(data)
})

router.put('/:id',async(req,res)=>{
    let id = req.params.id
    let data = {
        jobtitle: req.body.jobtitle,
        jobdescription : req.body.jobdescription,
        salary: req.body.salary,
        experience : req.body.experience,
        location: req.body.location
    }
    await JobDetail.findByIdAndUpdate(id,data,(err,docs)=>{
        if(!err){
            res.json("Updated Successfully")
        }else{
            res.json('Failed to update')
        }
    })
    
})

router.delete('/:id',async(req,res)=>{
    var id = req.params.id
    var deleted = await JobDetail.findByIdAndDelete(id)
    res.json("successfully Deleted")
})
module.exports = router
