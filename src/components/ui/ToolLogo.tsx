"use client";

import { cn } from "@/lib/utils";
import { usePageTheme } from "@/lib/theme";
import { motion } from "framer-motion";

interface ToolLogoProps {
  name: string;
  className?: string;
}

const toolImageMap: Record<string, string> = {
  // Existing PNGs
  "Python": "/images/tools/python.png",
  "SQL": "/images/tools/sql.png",
  "MySQL": "/images/tools/sql.png",
  "Tableau": "/images/tools/tableau.png",
  "Power BI": "/images/tools/power-bi.png",
  "Pandas": "/images/tools/pandas.png",
  "TensorFlow": "/images/tools/tensorflow.png",
  "PyTorch": "/images/tools/pytorch.png",
  "MongoDB": "/images/tools/mongodb.png",
  "Spark": "/images/tools/spark.png",
  "Apache Spark": "/images/tools/spark.png",
  "PySpark": "/images/tools/spark.png",
  "Docker": "/images/tools/docker.png",
  "AWS": "/images/tools/aws.png",
  "AWS QuickSight": "/images/tools/aws.png",
  "Flask": "/images/tools/flask.png",
  "Looker": "/images/tools/looker.png",
  "Excel": "/images/tools/excel.png",
  "Scikit-learn": "/images/tools/scikit-learn.png",
  "Scikit-Learn": "/images/tools/scikit-learn.png",
  // New SVGs
  "R": "/images/tools/r.svg",
  "NumPy": "/images/tools/numpy.svg",
  "Matplotlib": "/images/tools/matplotlib.svg",
  "Seaborn": "/images/tools/matplotlib.svg",
  "Jupyter": "/images/tools/jupyter.svg",
  "Google Colab": "/images/tools/google-colab.svg",
  "Git": "/images/tools/git.svg",
  "FastAPI": "/images/tools/fastapi.svg",
  "Hadoop": "/images/tools/hadoop.svg",
  "Azure": "/images/tools/azure.svg",
  "Plotly": "/images/tools/plotly.svg",
  "GCP": "/images/tools/gcp.svg",
  "Google Analytics": "/images/tools/google-analytics.svg",
  "HuggingFace": "/images/tools/huggingface.svg",
  "SciPy": "/images/tools/scipy.svg",
  "SpaCy": "/images/tools/spacy.svg",
  "Scrapy": "/images/tools/scrapy.svg",
  "Imbalanced-learn": "/images/tools/scikit-learn.png",
  "Statsmodels": "/images/tools/scipy.svg",
};

export default function ToolLogo({ name, className }: ToolLogoProps) {
  const imageSrc = toolImageMap[name];

  const theme = usePageTheme();
  const light = theme === "light";

  return (
    <motion.div
      className={cn(
        "flex items-center justify-center gap-3 px-4 py-3 rounded-xl",
        light
          ? "bg-gray-50 border border-gray-200"
          : "bg-white/[0.04] border border-white/[0.08]",
        "hover:bg-orange-500/10 hover:border-orange-500/20",
        "transition-colors duration-300 cursor-default",
        className
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={name}
          width={24}
          height={24}
          className="w-6 h-6 object-contain"
          loading="lazy"
        />
      ) : (
        <span className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold">
          {name.charAt(0)}
        </span>
      )}
      <span className={cn("text-sm font-medium", light ? "text-gray-700" : "text-gray-300")}>{name}</span>
    </motion.div>
  );
}
