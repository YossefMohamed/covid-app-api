import mongoose, { Schema } from "mongoose";



export interface SampleInterface extends Document {
    link : string;
    user : mongoose.Schema.Types.ObjectId;
    covid:boolean;
    breathProblem:boolean;
    heatProblem:boolean;
  }

const sampleSchema: Schema<SampleInterface> = new mongoose.Schema<SampleInterface>(
    {
      link : {
          type : String,
            required : true,

      },
      covid : {
          type : Boolean,

      },
      breathProblem : {
          type : Boolean,
      },
      heatProblem : {
          type : Boolean,
      }
      ,
      user : {
          type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
      }
    },
    {
      timestamps: true,
    }
  );


  const Sample = mongoose.model<SampleInterface>("Sample", sampleSchema);
export default Sample;