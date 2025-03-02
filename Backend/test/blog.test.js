const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../app'); // Adjust the path to your app entry file
const Blog = require('../models/Blog');
const { expect } = chai;
chai.use(chaiHttp);

describe('Blog API Tests', () => {
    let adminToken;
    let blogId;

    before(async () => {
        // Mock the admin user token
        adminToken = 'mockAdminToken'; // Replace with actual JWT token generation logic if needed
    });

    afterEach(() => {
        sinon.restore(); // Clean up after each test
    });

    it('should add a new blog (admin only)', async () => {
        const newBlog = {
            title: 'Test Blog',
            content: 'This is a test blog content.',
            author: 'Admin User',
            image: 'test-image.jpg',
            createdAt: new Date(),
        };

        sinon.stub(Blog.prototype, 'save').resolves({
            _id: 'mockBlogId',
            ...newBlog
        });

        const res = await chai
            .request(app)
            .post('/blogs/addBlog')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newBlog);

        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message', 'Blog added successfully');
        expect(res.body.blog).to.have.property('_id');
        blogId = res.body.blog._id;
    });

    it('should not add a new blog (unauthorized, non-admin)', async () => {
        const newBlog = {
            title: 'Test Blog',
            content: 'This is a test blog content.',
            author: 'Non-Admin User',
            image: 'test-image.jpg',
            createdAt: new Date(),
        };

        const res = await chai
            .request(app)
            .post('/blogs/addBlog')
            .set('Authorization', 'Bearer mockNonAdminToken')
            .send(newBlog);

        expect(res).to.have.status(403);
        expect(res.body).to.have.property('message', 'Access Denied: Only admins can add blogs.');
    });

    it('should get all blogs', async () => {
        const mockBlogs = [{
            _id: 'blog1',
            title: 'Test Blog 1',
            content: 'Content for blog 1',
            author: 'Author 1',
            image: 'image1.jpg',
            createdAt: new Date(),
        }, {
            _id: 'blog2',
            title: 'Test Blog 2',
            content: 'Content for blog 2',
            author: 'Author 2',
            image: 'image2.jpg',
            createdAt: new Date(),
        }];

        sinon.stub(Blog, 'find').resolves(mockBlogs);

        const res = await chai.request(app).get('/blogs/allBlog');
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Blogs fetched successfully');
        expect(res.body.blogs).to.be.an('array').that.has.lengthOf(2);
    });

    it('should get a blog by ID', async () => {
        const mockBlog = {
            _id: blogId,
            title: 'Test Blog',
            content: 'This is a test blog content.',
            author: 'Admin User',
            image: 'test-image.jpg',
            createdAt: new Date(),
        };

        sinon.stub(Blog, 'findById').resolves(mockBlog);

        const res = await chai.request(app).get(`/blogs/blogById/${blogId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Blog fetched successfully');
        expect(res.body.blog).to.have.property('_id', blogId);
    });

    it('should update a blog (admin only)', async () => {
        const updatedData = {
            title: 'Updated Blog Title',
            content: 'Updated content for the blog.',
        };

        sinon.stub(Blog, 'findByIdAndUpdate').resolves({
            _id: blogId,
            ...updatedData
        });

        const res = await chai
            .request(app)
            .put(`/blogs/updateBlog/${blogId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(updatedData);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Blog updated successfully');
    });

    it('should not update a blog (unauthorized, non-admin)', async () => {
        const updatedData = {
            title: 'Updated Blog Title',
            content: 'Updated content for the blog.',
        };

        const res = await chai
            .request(app)
            .put(`/blogs/updateBlog/${blogId}`)
            .set('Authorization', 'Bearer mockNonAdminToken')
            .send(updatedData);

        expect(res).to.have.status(403);
        expect(res.body).to.have.property('message', 'Access Denied: Only admins can update blogs.');
    });

    it('should delete a blog (admin only)', async () => {
        sinon.stub(Blog, 'findByIdAndDelete').resolves({ _id: blogId });

        const res = await chai
            .request(app)
            .delete(`/blogs/deleteBlog/${blogId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Blog deleted successfully');
    });

    it('should not delete a blog (unauthorized, non-admin)', async () => {
        const res = await chai
            .request(app)
            .delete(`/blogs/deleteBlog/${blogId}`)
            .set('Authorization', 'Bearer mockNonAdminToken');

        expect(res).to.have.status(403);
        expect(res.body).to.have.property('message', 'Access Denied: Only admins can delete blogs.');
    });

    it('should upload an image for a blog', async () => {
        const mockFile = { filename: 'mock-image.jpg', size: 100000 };
        const mockRequest = {
            file: mockFile,
            body: { blogId: blogId },
        };

        sinon.stub(Blog, 'findById').resolves({ _id: blogId, image: '' });
        sinon.stub(Blog.prototype, 'save').resolves({ _id: blogId, image: 'mock-image.jpg' });

        const res = await chai
            .request(app)
            .post('/blogs/uploadImage')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('blogId', blogId)
            .attach('blogImage', mockFile.filename);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Image uploaded successfully');
        expect(res.body).to.have.property('imageUrl', mockFile.filename);
    });

    it('should not upload an image (no blogId)', async () => {
        const res = await chai
            .request(app)
            .post('/blogs/uploadImage')
            .set('Authorization', `Bearer ${adminToken}`)
            .attach('blogImage', 'mock-image.jpg');

        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message', 'Blog ID is required');
    });

    it('should not upload an image (exceeds size limit)', async () => {
        const mockFile = { filename: 'mock-image.jpg', size: 5000000 }; // 5MB file

        const res = await chai
            .request(app)
            .post('/blogs/uploadImage')
            .set('Authorization', `Bearer ${adminToken}`)
            .attach('blogImage', mockFile.filename);

        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message', 'Please upload an image less than 2MB');
    });
});
