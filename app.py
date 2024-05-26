from flask import Flask, request
from werkzeug.utils import secure_filename
import os
import torch
import clip
from PIL import Image
from torchvision.transforms import functional as F
from flask_cors import CORS  # 导入 CORS

# 加载模型和设备设置
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# 英语文本标签
text_labels_en = ["a mobile phone", "a thermal mug", "a pen","a plastic bottle","a traditional camera","a car","a rubber","a CD","a power adaptor","a computer mouse","a lipstick","a battery","a eyewear","a key","an earphone","a headphone","a bottle of acrylic paint","a power bank","a USB flash disk","a tape","a watch","a cigarette","a pencil","a lighter","a surgical mask","a plastic bag","a plush doll","a badge","a paper","a plant"]  # 省略了其他标签
# 对应的汉语文本标签
text_labels_zh = ["手机", "保温杯", "笔", "塑料瓶", "相机", "汽车", "橡皮", "CD", "电源适配器", "鼠标", "口红", "电池","眼镜","钥匙","耳机","头戴耳机","丙烯颜料","移动电源设备","U盘","胶带","手表","香烟制品","铅笔","打火机","医用口罩","塑料袋与塑料制品","毛绒娃娃","徽章","纸类","植物类"]  # 省略了其他标签

text_inputs = clip.tokenize(text_labels_en).to(device)

# 预先计算文本特征（只需要一次）
with torch.no_grad():
    text_features = model.encode_text(text_inputs)
    text_features /= text_features.norm(dim=-1, keepdim=True)

app = Flask(__name__)
CORS(app)  # 使用 CORS
UPLOAD_FOLDER = './'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return "start", 200

@app.route('/favicon.ico')
def favicon():
    return '', 204

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        print('No file part')
        return 'No file part', 400
    file = request.files['image']
    if file.filename == '':
        print('No selected file')
        return 'No selected file', 400
    filename = secure_filename('phototest.jpg')
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    try:
        file.save(file_path)
        # 加载要识别的特定图片
        image_path = "phototest.jpg"  # 替换为要识别的图片路径
        image_pil = Image.open(image_path)
        image = preprocess(image_pil).unsqueeze(0).to(device)

        # 计算图像特征
        with torch.no_grad():
            image_features = model.encode_image(image)
            image_features /= image_features.norm(dim=-1, keepdim=True)

            # 计算图像特征与文本标签的余弦相似度
            similarities = (image_features @ text_features.t()).squeeze(0)

            # 打印最高概率的标签和相似度
            _, max_prob_index = similarities.topk(1)
            max_prob_index = max_prob_index.item()
            max_prob = similarities[max_prob_index].item()
            text_w = f"{text_labels_zh[max_prob_index]}"
            print(text_w)
        return text_w, 200
    except Exception as e:
        print(f'Error saving file: {e}')
        return 'Error saving file', 500

if __name__ == '__main__':
    app.run(debug=True)
