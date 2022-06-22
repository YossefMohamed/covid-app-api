import mongoose, { Schema } from "mongoose";

export interface SampleInterface extends Document {
  link: string;
  user: mongoose.Schema.Types.ObjectId;
  covid: boolean;
  breathProblem: boolean;
  fever: boolean;
  tested: boolean;
  report : string;
  verified : boolean;
}

const sampleSchema: Schema<SampleInterface> =
  new mongoose.Schema<SampleInterface>(
    {
      link: {
        type: String,
        required: true,
      },
      covid: {
        type: Boolean,
      },
      breathProblem: {
        type: Boolean,
      },
      fever: {
        type: Boolean,
      },
      tested: {
        type: Boolean,
        default : false
      },
      report : {
        type: String,
        default : ""
      },
      verified : {
        type : Boolean
      }
      ,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      
    },
    {
      timestamps: true,
    }
  );

  

const Sample = mongoose.model<SampleInterface>("Sample", sampleSchema);
export default Sample;
