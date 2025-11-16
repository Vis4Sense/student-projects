"""
Author: Henry X
Date: 2025/11/16 17:18
File: test_embed.py
Description: [Add your description here]
"""

from services.embed_service import embed_service
import logging

logging.basicConfig(level=logging.INFO)


def test_embed_service():

    service = embed_service

    test_abstracts = [
        """Deep learning has dramatically improved the state of the art in speech recognition, 
        visual object recognition, object detection and many other domains such as drug discovery 
        and genomics. Deep convolutional nets have brought about breakthroughs in processing images, 
        video, speech and audio, whereas recurrent nets have shone light on sequential data such as 
        text and speech. In this paper, we provide a comprehensive review of the major deep learning 
        techniques used in natural language processing and computer vision. We describe the basic 
        building blocks of modern deep learning systems including feedforward networks, convolutional 
        networks, and recurrent networks. We then survey several representative applications in these 
        two domains and discuss the insights gained from applying deep learning to these problems.""",

        """Natural language processing (NLP) has recently achieved great success by using large 
        pre-trained language models. These models are typically trained on vast amounts of text data 
        and can be fine-tuned for various downstream tasks. BERT, one of the most influential models, 
        introduced bidirectional training of Transformer models for language understanding. GPT models 
        demonstrated the power of autoregressive language modeling at scale. In this work, we propose 
        a novel architecture that combines the strengths of both approaches. We show that our model 
        achieves state-of-the-art results on multiple NLP benchmarks while being more efficient to train 
        and deploy. Our experiments demonstrate significant improvements on tasks including question 
        answering, sentiment analysis, and named entity recognition.""",

        """Machine learning techniques have shown tremendous potential in healthcare applications, 
        ranging from disease diagnosis to treatment recommendation and patient outcome prediction. 
        In this study, we present a comprehensive survey of deep learning methods applied to medical 
        imaging analysis. We review convolutional neural networks for image classification, object 
        detection frameworks for lesion localization, and segmentation models for anatomical structure 
        delineation. We also discuss the challenges unique to medical imaging, including limited labeled 
        data, class imbalance, and the need for model interpretability. Our analysis covers applications 
        in radiology, pathology, and ophthalmology. We conclude with a discussion of future research 
        directions and the path toward clinical deployment of these systems.""",

        """Computer vision has experienced rapid advancement with the introduction of deep learning 
        techniques. Object detection, a fundamental task in computer vision, aims to locate and classify 
        objects in images or videos. Traditional methods relied on hand-crafted features and sliding 
        window approaches. Modern deep learning-based detectors, such as Faster R-CNN, YOLO, and SSD, 
        have significantly improved both accuracy and speed. In this paper, we propose a novel two-stage 
        detector that incorporates attention mechanisms and feature pyramid networks. Our method achieves 
        superior performance on the COCO dataset while maintaining real-time inference speed. We conduct 
        extensive ablation studies to analyze the contribution of each component and demonstrate the 
        effectiveness of our approach on various challenging scenarios including occlusion and scale 
        variation.""",

        """Transformer models have revolutionized the field of natural language processing since their 
        introduction in 2017. The self-attention mechanism enables these models to capture long-range 
        dependencies in sequences more effectively than traditional recurrent architectures. Building 
        on this success, Vision Transformers (ViT) have recently emerged as a powerful alternative to 
        convolutional neural networks for image recognition tasks. In this work, we investigate the 
        application of transformer architectures to multimodal learning, where we process both visual 
        and textual information jointly. We propose a unified framework that leverages cross-modal 
        attention to learn rich representations that capture the semantic relationships between images 
        and text. Our experiments on image-text retrieval and visual question answering demonstrate 
        the effectiveness of our approach, achieving new state-of-the-art results on multiple benchmarks.""",

        """Reinforcement learning has shown remarkable success in complex decision-making tasks, from 
        game playing to robotics control. Deep reinforcement learning combines neural networks with 
        reinforcement learning algorithms to learn policies directly from high-dimensional sensory inputs. 
        However, these methods often require large amounts of interaction data and can be sample-inefficient. 
        In this paper, we propose a model-based reinforcement learning approach that learns a dynamics 
        model of the environment and uses it for planning. Our method incorporates uncertainty estimation 
        to handle model errors and employs a hybrid strategy that combines model-based and model-free 
        learning. We evaluate our approach on a suite of continuous control tasks and demonstrate 
        significant improvements in sample efficiency compared to state-of-the-art model-free algorithms. 
        Our results show that incorporating model-based planning can accelerate learning while maintaining 
        or improving final performance.""",

        """Graph neural networks (GNNs) have emerged as a powerful tool for learning on graph-structured 
        data. Unlike traditional neural networks that operate on grid-like structures, GNNs can naturally 
        handle irregular graph topologies and leverage both node features and graph structure. Recent 
        advances in GNN architectures have enabled applications in diverse domains including social network 
        analysis, molecular property prediction, and recommendation systems. In this survey, we provide 
        a comprehensive overview of GNN methods, including spectral and spatial approaches. We discuss 
        various aggregation schemes, attention mechanisms, and graph pooling strategies. We also review 
        important applications and datasets commonly used for benchmarking. Finally, we highlight current 
        challenges and promising future research directions in the field of graph representation learning.""",

        """Generative adversarial networks (GANs) have revolutionized generative modeling by introducing 
        an adversarial training framework. The generator network learns to create realistic samples while 
        the discriminator learns to distinguish real from generated data. Since their introduction, GANs 
        have been successfully applied to image synthesis, style transfer, and data augmentation. However, 
        training GANs remains challenging due to issues such as mode collapse and training instability. 
        In this work, we propose a novel training procedure that improves convergence and stability. Our 
        method incorporates a progressive growing strategy and a self-attention mechanism to generate 
        high-resolution images with fine details. We conduct extensive experiments on face generation and 
        natural image synthesis, demonstrating that our approach produces higher quality and more diverse 
        samples compared to existing methods. We also provide theoretical analysis of the convergence 
        properties of our training algorithm."""
    ]

    print(f"Testing with {len(test_abstracts)} realistic long abstracts...")
    print(f"Average abstract length: {sum(len(a) for a in test_abstracts) / len(test_abstracts):.0f} characters\n")

    print("=== Testing UMAP Reduction ===")
    coords_umap = service.get_2d_coordinates(test_abstracts, method="umap")
    print(f"Generated {len(coords_umap)} coordinates\n")
    for i, (x, y) in enumerate(coords_umap):

        topic = test_abstracts[i][:500] + "..."
        print(f"Paper {i} [{topic}]")
        print(f"  UMAP coords: ({x:.3f}, {y:.3f})")

    print("\n=== Testing t-SNE Reduction ===")
    coords_tsne = service.get_2d_coordinates(test_abstracts, method="tsne")
    print(f"Generated {len(coords_tsne)} coordinates\n")
    for i, (x, y) in enumerate(coords_tsne):
        topic = test_abstracts[i][:500] + "..."
        print(f"Paper {i} [{topic}]")
        print(f"  t-SNE coords: ({x:.3f}, {y:.3f})")

    print("\n=== Testing Single Abstract Projection ===")
    new_abstract = """We present a novel approach to few-shot learning that leverages 
    meta-learning techniques to quickly adapt to new tasks with limited labeled examples."""

    coord = service.get_single_2d_coordinate(new_abstract, reference_texts=test_abstracts)
    print(f"New abstract coordinate: ({coord[0]:.3f}, {coord[1]:.3f})")

    print("\n✅ All tests passed!")

    print("\n=== Statistics ===")
    print(f"Model: {service.model_name}")
    print(f"Reduction method: {service.reduction_method}")
    print(f"Cache directory: {service.cache_dir}")


if __name__ == "__main__":
    test_embed_service()
